import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { PRODUCTS } from "@/data/products";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PROJECT_TYPES = [
  "Commercial New Construction",
  "Roof Replacement / Re-Roof",
  "Industrial Maintenance & Repair",
  "Custom Fabrication Run",
  "Other",
];

const EMPTY = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  project_type: PROJECT_TYPES[0],
  estimated_quantities: "",
  specifications_notes: "",
};

export default function QuoteForm({
  preselected = [],
  submitTestId = "quote-form-submit-button",
  formTestId,
  compact = false,
}) {
  const [form, setForm] = useState(EMPTY);
  const [selected, setSelected] = useState(preselected);
  const [status, setStatus] = useState("idle");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleProduct = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((p) => p !== id) : [...s, id]));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`${API}/quote-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, products_selected: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail?.[0]?.msg || data?.detail || "Submission failed");
      setReference(data.reference);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border border-linehi bg-panel p-8 text-center sm:p-12"
        data-testid="quote-success-panel"
      >
        <CheckCircle2 className="mx-auto text-forge" size={44} strokeWidth={1.5} />
        <h3 className="mt-5 font-head text-3xl font-bold uppercase tracking-tight text-slate-100">
          Request Logged
        </h3>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-steel">
          Reference Code
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tracking-[0.15em] text-forge" data-testid="quote-reference-code">
          {reference}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
          Your request is in the estimating queue. An estimator will reply within one business
          day with pricing and lead times. A confirmation is on its way to your inbox.
        </p>
        <button
          type="button"
          data-testid="quote-submit-another-button"
          onClick={() => {
            setStatus("idle");
            setForm(EMPTY);
            setSelected([]);
          }}
          className="mt-7 border border-linehi px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-200 transition-colors hover:border-forge hover:text-forge"
        >
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  const grid = compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2";

  return (
    <form onSubmit={submit} data-testid={formTestId} className="space-y-4">
      <div className={grid}>
        <div>
          <label htmlFor="qf-company" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
            Company *
          </label>
          <input
            id="qf-company"
            data-testid="quote-field-company"
            required
            minLength={2}
            value={form.company_name}
            onChange={set("company_name")}
            placeholder="Acme Roofing Contractors"
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="qf-contact" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
            Contact Name *
          </label>
          <input
            id="qf-contact"
            data-testid="quote-field-contact"
            required
            minLength={2}
            value={form.contact_name}
            onChange={set("contact_name")}
            placeholder="Jordan Miller"
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="qf-email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
            Work Email *
          </label>
          <input
            id="qf-email"
            data-testid="quote-field-email"
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="j.miller@acmeroofing.com"
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="qf-phone" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
            Phone
          </label>
          <input
            id="qf-phone"
            data-testid="quote-field-phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="(312) 555-0148"
            className="field-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="qf-project-type" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
          Project Type *
        </label>
        <select
          id="qf-project-type"
          data-testid="quote-field-project-type"
          value={form.project_type}
          onChange={set("project_type")}
          className="field-input appearance-none"
        >
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
          Products Needed
        </span>
        <div className="flex flex-wrap gap-2" data-testid="quote-product-chips">
          {PRODUCTS.map((p) => {
            const active = selected.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                data-testid={`quote-chip-${p.id}`}
                onClick={() => toggleProduct(p.id)}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-200 ${
                  active
                    ? "border-forge bg-forge/15 text-forge"
                    : "border-line text-slate-400 hover:border-linehi hover:text-slate-200"
                }`}
              >
                {p.shortName}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="qf-qty" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
          Estimated Quantities
        </label>
        <input
          id="qf-qty"
          data-testid="quote-field-quantities"
          value={form.estimated_quantities}
          onChange={set("estimated_quantities")}
          placeholder='e.g. 24x 4" copper drains, 300 LF coping'
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="qf-notes" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
          Specifications / Notes
        </label>
        <textarea
          id="qf-notes"
          data-testid="quote-field-notes"
          rows={compact ? 3 : 5}
          value={form.specifications_notes}
          onChange={set("specifications_notes")}
          placeholder="Gauges, finishes, parapet depths, delivery zip, target install date..."
          className="field-input resize-none"
        />
      </div>

      {status === "error" && (
        <p data-testid="quote-form-error" className="flex items-center gap-2 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle size={15} strokeWidth={1.5} /> {error}
        </p>
      )}

      <button
        type="submit"
        data-testid={submitTestId}
        disabled={status === "sending"}
        className="group flex w-full items-center justify-center gap-2 border border-forge bg-forge px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-forge disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Transmitting
          </>
        ) : (
          "Submit Quote Request"
        )}
      </button>
    </form>
  );
}
