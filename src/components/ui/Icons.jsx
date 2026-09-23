export function Icon({ children, size = 18, className = "", style = {}, ...props }) {
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
      style={{ flexShrink: 0, ...style }}
      aria-hidden
      {...props}
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

export const IconClipboard = (p) => (
  <Icon {...p}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="M9 11h6M9 15h6" />
  </Icon>
);

export const IconUsersGear = (p) => (
  <Icon {...p}>
    <path d="M3 20v-1a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v1" />
    <circle cx="8.5" cy="8" r="3" />
    <circle cx="18" cy="17.5" r="2" />
    <path d="M18 14.3v-.8M18 20.5v.8M20.6 17.5h.8M14.6 17.5h.8M19.9 16l.6-.6M15.5 19.6l.6-.6M19.9 19l.6.6M15.5 15.4l.6.6" />
  </Icon>
);

export const IconPalmTree = (p) => (
  <Icon {...p}>
    <path d="M12 22V11" />
    <path d="M12 12c0-3-2-5-5-5 0 3 2 5 5 5z" />
    <path d="M12 12c0-3 2-5 5-5 0 3-2 5-5 5z" />
    <path d="M12 11c0-3 1.6-5.5 4-7 0 3-1 5.5-4 7z" />
    <path d="M12 11c0-3-1.6-5.5-4-7 0 3 1 5.5 4 7z" />
  </Icon>
);

export const IconWallet = (p) => (
  <Icon {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    <path d="M16 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a2 2 0 0 1 0-4z" />
  </Icon>
);

export const IconCoins = (p) => (
  <Icon {...p}>
    <ellipse cx="9" cy="7" rx="6" ry="3.2" />
    <path d="M3 7v5c0 1.77 2.69 3.2 6 3.2s6-1.43 6-3.2V7" />
    <path d="M9 12.2v5c0 1.77 2.69 3.2 6 3.2s6-1.43 6-3.2v-5" />
    <ellipse cx="15" cy="12.2" rx="6" ry="3.2" />
  </Icon>
);

export const IconChat = (p) => (
  <Icon {...p}>
    <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </Icon>
);

export const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconLogout = (p) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </Icon>
);

export const IconAlertTriangle = (p) => (
  <Icon {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Icon>
);

export const IconCheck = (p) => (
  <Icon {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Icon>
);

export const IconExpand = (p) => (
  <Icon {...p}>
    <path d="M9 3H3v6M15 3h6v6M21 15v6h-6M3 15v6h6" />
  </Icon>
);
