# ForgeLine Metals — PRD

## Original Problem Statement
Build a 10/10 dark-mode website for a manufacturer of metal commercial roofing supplies for flat roofs (roof drains, drain cones, pitch pockets, roof sumps, scuppers, custom flashing, roof curbs, metal sleeves). Sharp edges, reactive/alive feel, catchy hero with cool background, Home + Products + Contact pages, professional and not obviously AI.

## User Choices
- Company name invented: "ForgeLine Metals" with steel-blue (#38BDF8) + safety-orange (#FF5500) accents
- Contact form: saves enquiries to database AND sends email notification (Resend via Emergent-managed proxy)
- Product page: full depth — all 8 products with specs, materials, gauges, request-quote buttons

## Architecture
- Frontend: React 19 + Tailwind (custom industrial dark theme) + framer-motion + lenis smooth scroll. Pages: Home, Products, Contact. Components: Navbar, Footer, Marquee, SparkCanvas, QuoteModal, QuoteForm, ProductDiagram (SVG blueprints), Reveal helpers.
- Backend: FastAPI, POST /api/quote-request (Mongo persist + owner notification + customer confirmation emails via Emergent managed email proxy with guardrail gate).
- DB: MongoDB `quote_requests` collection (reference code FGM-YYYY-####, status, created_at).

## Implemented (2026-09-16)
- Kinetic hero: masked line-by-line title reveal, parallax background photo, blueprint grid, floating spark particles, mouse-tilt 3D photo frame, coordinate/scroll ticker
- Numbered manifesto (01 Zero Leaks → 04 Architect-Specified), slow editorial spec marquee, shop-floor photo showcase with corner-frame hover, animated stat counters, featured product strip, CTA band
- Products page: 8 products with SVG technical diagrams, category filter tabs, spotlight hover, expandable spec sheets (materials/gauges/sizes/finishes/ASTM), per-product quote trigger with preselect
- Contact page: RFQ form (company/contact/email/phone/project type/product chips/quantities/notes) → DB + emails + on-screen reference code; contact info panels
- Backend email: owner notification + customer confirmation, both delivered (verified in testing)

## User Personas
- Roofing contractor / estimator requesting priced quotes
- Architect verifying specs and certifications (ES-1, SMACNA, ASTM)
- Facility/maintenance manager ordering replacement components

## Pending / Blockers
- OWNER_EMAIL currently set to test inbox delivered@resend.dev — user must provide their real business email to receive quote notifications in their own inbox (one-line .env change + backend restart)

## Backlog
- P0: Point OWNER_EMAIL at the real business inbox
- P1: Quote inbox/admin view listing submitted RFQs (auth-protected)
- P1: File upload for shop drawings (PDF) attached to quote requests
- P2: Individual product detail pages with downloadable spec-sheet PDFs
- P2: Real photography of fabricated products when available
