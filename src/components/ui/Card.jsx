export function Card({ className = "", children }) {
  return (
    <div className={`rounded-card bg-white p-8 ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({ kicker, title, action }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        {kicker ? (
          <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            {kicker}
          </p>
        ) : null}
        <h1 className="text-[28px] font-bold leading-tight text-ink">{title}</h1>
      </div>
      {action}
    </div>
  );
}
