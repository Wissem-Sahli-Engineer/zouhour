export function Field({ label, error, children }) {
  return (
    <div className={`mb-4.5 ${error ? "text-danger" : ""}`}>
      {label ? (
        <label className={`mb-1.5 block text-label ${error ? "text-danger" : "text-ink"}`}>
          {label}
        </label>
      ) : null}
      {children}
    </div>
  );
}

export function UnderlineInput({ error, className = "", ...props }) {
  return (
    <input
      className={`w-full border-0 border-b-[1.5px] bg-transparent py-2 pr-7 text-body text-ink outline-none transition-colors placeholder:text-muted/70 ${
        error ? "border-danger" : "border-line focus:border-brand"
      } ${className}`}
      {...props}
    />
  );
}

export function BoxInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 text-body text-ink outline-none transition-colors focus:border-brand ${className}`}
      {...props}
    />
  );
}

export function BoxSelect({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 text-body text-ink outline-none transition-colors focus:border-brand ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
