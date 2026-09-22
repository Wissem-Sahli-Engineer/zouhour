export function Button({
  children,
  variant = "brand",
  className = "",
  loading = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${loading ? "btn-spinner" : ""} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
