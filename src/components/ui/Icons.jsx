export function Icon({ children, size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const LogoMark = ({ size = 28, className = "", style = {}, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: "var(--color-brand)", ...style }}
    aria-hidden
    {...props}
  >
    <path d="M12 2L2 8l10 6 10-6-10-6z" fill="currentColor" />
    <path d="M2 16l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconGrid = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);

export const IconChart = (p) => (
  <Icon {...p}>
    <path d="M4 19V5" />
    <path d="M4 19h16" />
    <path d="M8 15l3-4 3 2 5-7" />
  </Icon>
);

export const IconPeople = (p) => (
  <Icon {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="3.2" />
    <path d="M22 21v-2a3.5 3.5 0 0 0-3-3.4" />
    <path d="M16 3.5a3.2 3.2 0 0 1 0 6.3" />
  </Icon>
);

export const IconLedger = (p) => (
  <Icon {...p}>
    <path d="M6 4h12a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z" />
    <path d="M9 8h7M9 12h7M9 16h4" />
  </Icon>
);

export const IconBot = (p) => (
  <Icon {...p}>
    <rect x="5" y="8" width="14" height="10" rx="3" />
    <path d="M12 8V5" />
    <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="13" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const IconSearch = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);

export const IconBell = (p) => (
  <Icon {...p}>
    <path d="M6 9a6 6 0 1 1 12 0c0 7 2 7 2 9H4c0-2 2-2 2-9" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Icon>
);

export const IconMenu = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h10M4 17h16" />
  </Icon>
);

export const IconEye = (p) => (
  <Icon {...p}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const IconWhatsApp = (p) => (
  <Icon {...p}>
    <path d="M20 12.1A8 8 0 0 1 6.9 18.6L4 20l1.5-2.8A8 8 0 1 1 20 12.1z" />
    <path d="M9.5 9.2c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.2.5l-.6.5c.3.6.8 1.1 1.4 1.5l.5-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.6c0 .3 0 .5-.5.7A6 6 0 0 1 9.5 9.2z" />
  </Icon>
);

export const IconScan = (p) => (
  <Icon {...p}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
  </Icon>
);

export const IconClose = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const IconSend = (p) => (
  <Icon {...p}>
    <path d="M4 12l16-8-6 16-2-7-8-1z" />
  </Icon>
);
