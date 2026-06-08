import type { ReactNode } from "react";

export function Pill({ children, tone = "info" }: { children: ReactNode; tone?: "good" | "warn" | "bad" | "info" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export function Card({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="card">
      <div className="section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  options,
  type = "text",
  placeholder
}: {
  label: string;
  options?: string[];
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input type={type} placeholder={placeholder ?? label} />
      )}
    </label>
  );
}
