export function Field({ label, error, className = "", children }) {
  return (
    <div className={`field-group ${className}`}>
      {label ? (
        <label className={`field-label ${error ? "error" : ""}`}>
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
      className={`input-underline ${error ? "error" : ""} ${className}`}
      {...props}
    />
  );
}

export function BoxInput({ className = "", ...props }) {
  return (
    <input
      className={`input-box ${className}`}
      {...props}
    />
  );
}

export function BoxSelect({ className = "", children, ...props }) {
  return (
    <select
      className={`select-box ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
