export function Card({ className = "", children }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({ kicker, title, action }) {
  return (
    <div className="page-header">
      <div>
        {kicker ? (
          <p className="page-kicker">{kicker}</p>
        ) : null}
        <h1 className="page-title">{title}</h1>
      </div>
      {action}
    </div>
  );
}
