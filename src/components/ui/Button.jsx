export function Button({
  children,
  variant = "brand",
  className = "",
  loading = false,
  type = "button",
  ...props
}) {
  const variants = {
    brand:
      "bg-brand text-white hover:bg-brand-dark",
    ink: "bg-ink text-white hover:bg-black",
    ghost:
      "bg-white text-ink border-[1.5px] border-line hover:bg-[#f7f7f8] hover:border-[#d9d9de]",
    danger: "bg-[#fee2e2] text-[#dc2626] hover:bg-[#fca5a5]",
  };

  return (
    <button
      type={type}
      className={`relative w-full rounded-btn px-3 py-3 text-btn transition-[transform,background-color] duration-150 ease-out active:scale-[0.98] disabled:opacity-50 ${variants[variant]} ${loading ? "btn-spinner" : ""} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
