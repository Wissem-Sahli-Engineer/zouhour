import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChatbotPanel } from "../features/chatbot/ChatbotPanel";
import { ChatFab } from "../components/ChatFab";
import { NotificationBell } from "../components/NotificationBell";
import { GlobalSearch } from "../components/GlobalSearch";
import Magnet from "../components/ui/magnet";
import {
  IconBot,
  IconChart,
  IconClipboard,
  IconGrid,
  IconLedger,
  IconLogout,
  IconMenu,
  IconPeople,
  IconShield,
  IconUsersGear,
  IconWallet,
  LogoMark,
} from "../components/ui/Icons";
import { DURATION, EASE, ScrollTrigger, gsap, useGSAP } from "../lib/gsap";
import { destroyLenis, initLenis } from "../lib/lenis";
import { useAuth } from "../store/auth";
import { useUi } from "../store/ui";
import { RouteTransition } from "./RouteTransition";

const NAV_ACCOUNT = [
  { to: "/", label: "Dashboard", icon: IconGrid, end: true },
  { to: "/stats", label: "Stats", icon: IconChart },
  { to: "/clients", label: "Clients", icon: IconPeople },
  { to: "/accounting/tunisia", label: "Accounting TN", icon: IconLedger },
  { to: "/accounting/libya", label: "Accounting LY", icon: IconLedger },
];

const NAV_HR = [
  { to: "/MyRequests", label: "My Requests", icon: IconClipboard },
  { to: "/EmployeeRequests", label: "Employee Requests", icon: IconUsersGear },
  { to: "/Payroll", label: "Fiche de paie", icon: IconWallet },
  { to: "/Users", label: "Users", icon: IconShield },
];

export function AppShell() {
  const sidebarRef = useRef(null);
  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const sidebarOpen = useUi((s) => s.sidebarOpen);
  const toggleSidebar = useUi((s) => s.toggleSidebar);

  useGSAP(
    (context, contextSafe) => {
      const el = sidebarRef.current;
      if (!el) return;
      const labels = el.querySelectorAll("[data-label]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const width = sidebarOpen ? 232 : 76;
      gsap.to(el, {
        width,
        duration: reduce ? 0 : DURATION,
        ease: EASE,
        onComplete: contextSafe(() => ScrollTrigger.refresh()),
      });
      gsap.to(labels, {
        autoAlpha: sidebarOpen ? 1 : 0,
        x: sidebarOpen ? 0 : -6,
        duration: reduce ? 0 : 0.28,
        ease: EASE,
        stagger: sidebarOpen ? 0.02 : 0,
      });
    },
    { dependencies: [sidebarOpen], scope: sidebarRef }
  );

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    initLenis(node);
    return () => destroyLenis();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location.pathname]);

  const isAdmin = user?.role === "Admin";
  const navAccount = isAdmin ? NAV_ACCOUNT : NAV_ACCOUNT.slice(0, 3);
  const navHr = isAdmin ? NAV_HR : NAV_HR.filter((item) => item.to === "/EmployeeRequests");

  const initials = (user?.name || "AG")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="app-shell">
      <aside
        ref={sidebarRef}
        className={`app-sidebar ${sidebarOpen ? "" : "collapsed"}`}
      >
        <div className="sidebar-header">
          <img
            src="./logo.png"
            alt="Logo"
            className="sidebar-logo"
          />
          <div data-label className="sidebar-header-text">
            <span className="sidebar-brand-text">
              TCA
            </span>
            <span style={{ whiteSpace: "nowrap", color: "var(--color-text-muted)", fontSize: "10px" }}>
              Tunisian consulting agency
            </span>
          </div>
        </div>

        <hr className="sidebar-divider" />

        <nav className="sidebar-nav">
          {navAccount.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={item.label}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span data-label style={{ whiteSpace: "nowrap" }}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}

          <hr className="sidebar-divider" />

          {navHr.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={item.label}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span data-label style={{ whiteSpace: "nowrap" }}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}

          <hr className="sidebar-divider" />

          <button
            type="button"
            onClick={() => navigate("/chatbot")}
            className="nav-link"
            title="AI Chatbot"
            style={{ width: "100%", textAlign: "left" }}
          >
            <IconBot size={18} style={{ flexShrink: 0 }} />
            <span data-label style={{ whiteSpace: "nowrap" }}>
              AI Chatbot
            </span>
          </button>
        </nav>

        <p data-label className="sidebar-footer">
          Visa operations
        </p>
      </aside>

      <div className="app-main-column">
        <header className="app-header">
          <div className="header-left">
            <Magnet padding={22} magnetStrength={14}>
              <button
                type="button"
                onClick={toggleSidebar}
                className="icon-btn"
                aria-label="Toggle sidebar"
              >
                <IconMenu />
              </button>
            </Magnet>
            <GlobalSearch />
          </div>

          <div className="header-right">
            <NotificationBell />
            <div className="user-badge">
              <div className="avatar-circle">
                {initials || "AG"}
              </div>
              <div className="user-info-text">
                <p className="user-name">{user?.name || "Agent"}</p>
                <p className="user-role">{user?.role}</p>
              </div>
              <Magnet padding={22} magnetStrength={14}>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="btn-logout"
                >
                  <IconLogout size={14} />
                  Logout
                </button>
              </Magnet>
            </div>
          </div>
        </header>

        <main ref={scrollRef} className="app-main-scroll">
          <div className="app-page-padding">
            <RouteTransition>
              <Outlet />
            </RouteTransition>
          </div>
        </main>
      </div>

      <ChatbotPanel />
      <ChatFab />
    </div>
  );
}