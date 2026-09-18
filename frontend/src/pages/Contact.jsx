import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import SparkCanvas from "@/components/SparkCanvas";

const INFO = [
  {
    icon: Phone,
    label: "Call The Shop",
    lines: ["+1 (312) 555-0148", "Mon–Fri 06:00–18:00 EST"],
    href: "tel:+13125550148",
    testid: "contact-info-phone",
  },
  {
    icon: Mail,
    label: "Email The Estimators",
    lines: ["specs@forgelinemetals.com", "Attach shop drawings as PDF"],
    href: "mailto:specs@forgelinemetals.com",
    testid: "contact-info-email",
  },
  {
    icon: MapPin,
    label: "Plant & HQ",
    lines: ["51 Roysun Rd Unit 9", "Woodbridge, ON L4L 8P9"],
    testid: "contact-info-address",
  },
  {
    icon: Clock,
    label: "Response Standard",
    lines: ["Quote back within 48 hours", "Submittal packages in 5 days"],
    testid: "contact-info-response",
  },
];

export default function Contact() {
  return (
    <div className="pt-[72px]" data-testid="contact-page">
      <section className="relative overflow-hidden border-b border-line">
        <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
        <SparkCanvas density={20} />
        <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <SectionHead index="TLK" eyebrow="Direct To The Estimating Desk" title="Talk To The Shop" />
          <Reveal delay={0.15} className="mt-6 max-w-2xl">
            <p className="text-base leading-relaxed text-neutral-600">
              Call or email with the spec — sizes, gauges, finishes, quantities. A real estimator
              (not a bot) prices it and replies within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {INFO.map((item, i) => {
            const body = (
              <>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line text-steel transition-colors duration-300 group-hover:border-forge group-hover:text-forge">
                  <item.icon size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-steel">{item.label}</h3>
                  <p className="mt-2 font-head text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                    {item.lines[0]}
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                    {item.lines[1]}
                  </p>
                </div>
              </>
            );
            const cls =
              "group flex items-center gap-6 border border-line bg-panel/40 p-8 transition-colors duration-300 hover:border-forge/60 hover:bg-white";
            return (
              <Reveal key={item.label} delay={i * 0.1}>
                {item.href ? (
                  <a href={item.href} data-testid={item.testid} className={cls}>
                    {body}
                  </a>
                ) : (
                  <div data-testid={item.testid} className={cls}>
                    {body}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4}>
          <div className="relative mt-10 border border-linehi bg-panel/60 p-8 sm:p-10" data-testid="contact-note-panel">
            <span className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-forge" aria-hidden="true" />
            <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-forge" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-forge">Shop Note</p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700">
              Call or email with your sizes, gauges, and quantities — a real estimator (not a bot)
              prices it and gets back to you within one business day. Custom runs need a dimensioned
              sketch or shop drawing; no drawing yet? Describe the condition and our detailers will
              draft it for approval before we cut metal.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
