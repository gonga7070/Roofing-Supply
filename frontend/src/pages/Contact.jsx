import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import SparkCanvas from "@/components/SparkCanvas";
import QuoteForm from "@/components/QuoteForm";

const INFO = [
  {
    icon: MapPin,
    label: "Plant & HQ",
    lines: ["4420 S. Ironworks Avenue", "Chicago, IL 60609"],
    testid: "contact-info-address",
  },
  {
    icon: Phone,
    label: "Estimating Desk",
    lines: ["+1 (312) 555-0148", "Mon–Fri 06:00–18:00 CST"],
    testid: "contact-info-phone",
  },
  {
    icon: Mail,
    label: "Specs & Submittals",
    lines: ["specs@forgelinemetals.com", "Attach shop drawings as PDF"],
    testid: "contact-info-email",
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
          <SectionHead index="RFQ" eyebrow="Direct To The Estimating Desk" title="Request A Quote" />
          <Reveal delay={0.15} className="mt-6 max-w-2xl">
            <p className="text-base leading-relaxed text-slate-400">
              Send the spec — sizes, gauges, finishes, quantities. A real estimator (not a bot)
              prices it and replies within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {INFO.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.1}>
                <div
                  className="group flex gap-5 border border-line bg-panel/40 p-6 transition-colors duration-300 hover:border-linehi hover:bg-panel"
                  data-testid={item.testid}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-steel transition-colors duration-300 group-hover:border-forge group-hover:text-forge">
                    <item.icon size={18} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-steel">{item.label}</h3>
                    {item.lines.map((l) => (
                      <p key={l} className="mt-1.5 text-sm leading-relaxed text-slate-300">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.45}>
              <div className="border border-line bg-panel/40 p-6" data-testid="contact-note-panel">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-forge">
                  Shop Note
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Custom runs need a dimensioned sketch or shop drawing. No drawing yet? Describe
                  the condition — parapet depth, pipe diameter, joist spacing — and our detailers
                  will draft it for approval before we cut metal.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:col-span-7">
            <div className="relative border border-linehi bg-panel/60 p-6 sm:p-10">
              <span className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-forge" aria-hidden="true" />
              <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-forge" aria-hidden="true" />
              <QuoteForm
                formTestId="contact-quote-form"
                submitTestId="contact-form-submit-button"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
