import os
import re
import random
import logging
import ipaddress
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


async def try_send(**kwargs) -> str | None:
    try:
        return await send_email(**kwargs)
    except Exception as e:
        logger.error(f"Email delivery skipped: {e}")
        return None


class QuoteRequestCreate(BaseModel):
    company_name: str = Field(min_length=2, max_length=140)
    contact_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=40)
    project_type: str = Field(min_length=2, max_length=80)
    products_selected: List[str] = Field(default_factory=list)
    estimated_quantities: Optional[str] = Field(default="", max_length=300)
    specifications_notes: Optional[str] = Field(default="", max_length=4000)


def _row(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:8px 12px;border:1px solid #d7dde8;font-family:Arial,sans-serif;'
        f'font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6478;width:170px">{label}</td>'
        f'<td style="padding:8px 12px;border:1px solid #d7dde8;font-family:Arial,sans-serif;'
        f'font-size:13px;color:#0a0e17">{escape(value) if value else "&mdash;"}</td></tr>'
    )


def _owner_html(q: QuoteRequestCreate, ref: str) -> str:
    products = ", ".join(q.products_selected)
    rows = (
        _row("Reference", ref)
        + _row("Company", q.company_name)
        + _row("Contact", q.contact_name)
        + _row("Email", q.email)
        + _row("Phone", q.phone)
        + _row("Project Type", q.project_type)
        + _row("Products", products)
        + _row("Est. Quantities", q.estimated_quantities)
        + _row("Notes", q.specifications_notes)
    )
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        '<tr><td style="padding:24px;font-family:Arial,sans-serif;background:#0a0e17">'
        '<p style="margin:0;font-size:11px;letter-spacing:0.25em;color:#ff5500;text-transform:uppercase">ForgeLine Metals — RFQ Intake</p>'
        f'<h1 style="margin:8px 0 0;font-size:20px;color:#f8fafc">New quote request {escape(ref)}</h1>'
        '</td></tr>'
        f'<tr><td style="padding:24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">{rows}</table></td></tr>'
        f'<tr><td style="padding:16px 24px;font-family:Arial,sans-serif;font-size:12px;color:#8a93a6">Sent by {escape(EMAIL_FROM_NAME)} quote system. We never ask for passwords or payment details by email.</td></tr>'
        '</table>'
    )


def _customer_html(q: QuoteRequestCreate, ref: str) -> str:
    products = ", ".join(q.products_selected)
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        '<tr><td style="padding:24px;font-family:Arial,sans-serif;background:#0a0e17">'
        '<p style="margin:0;font-size:11px;letter-spacing:0.25em;color:#ff5500;text-transform:uppercase">ForgeLine Metals</p>'
        '<h1 style="margin:8px 0 0;font-size:20px;color:#f8fafc">Your quote request is in the shop queue</h1>'
        '</td></tr>'
        '<tr><td style="padding:24px;font-family:Arial,sans-serif;font-size:14px;color:#1a2233;line-height:1.6">'
        f'<p>Hi {escape(q.contact_name)},</p>'
        f'<p>Thanks for reaching out about <strong>{escape(q.company_name)}</strong>. Your request '
        f'<strong>{escape(ref)}</strong> has been logged with our estimating team.</p>'
        + (f'<p><strong>Products requested:</strong> {escape(products)}</p>' if products else '')
        + '<p>An estimator will reply within one business day with pricing, lead times, and any shop-drawing questions.</p>'
        '</td></tr>'
        f'<tr><td style="padding:16px 24px;font-family:Arial,sans-serif;font-size:12px;color:#8a93a6">Sent by {escape(EMAIL_FROM_NAME)}. We never ask for passwords or payment details by email.</td></tr>'
        '</table>'
    )


@api_router.get("/")
async def root():
    return {"message": "ForgeLine Metals API online"}


@api_router.post("/quote-request")
async def create_quote_request(payload: QuoteRequestCreate):
    ref = f"FGM-{datetime.now(timezone.utc).year}-{random.randint(1000, 9999)}"
    doc = payload.model_dump()
    doc.update({
        "reference": ref,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.quote_requests.insert_one(doc)
    owner_id = await try_send(
        to=OWNER_EMAIL,
        subject=f"New quote request {ref} — {payload.company_name}",
        html=_owner_html(payload, ref),
    )
    customer_id = await try_send(
        to=payload.email,
        subject=f"Quote request received — {ref}",
        html=_customer_html(payload, ref),
    )
    return {
        "status": "success",
        "reference": ref,
        "email_notifications": {"owner": bool(owner_id), "customer": bool(customer_id)},
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
