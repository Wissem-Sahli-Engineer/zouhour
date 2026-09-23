import Magnet from "./magnet";

export function Button({
  children,
  variant = "brand",
  className = "",
  loading = false,
  type = "button",
  ...props
}) {
  return (
    <Magnet block padding={26} magnetStrength={14}>
      <button
        type={type}
        className={`btn btn-${variant} ${loading ? "btn-spinner" : ""} ${className}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {children}
      </button>
    </Magnet>
  );
}
