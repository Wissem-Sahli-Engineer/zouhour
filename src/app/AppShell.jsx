import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChatbotPanel } from "../features/chatbot/ChatbotPanel";
import { WhatsAppFab } from "../components/WhatsAppFab";
import {
  IconBell,
  IconBot,
  IconChart,
  IconGrid,
  IconLedger,
  IconMenu,
  IconPeople,
  IconSearch,
  LogoMark,
} from "../components/ui/Icons";
import { DURATION, EASE, ScrollTrigger, gsap, useGSAP } from "../lib/gsap";
import { destroyLenis, initLenis } from "../lib/lenis";
import { useAuth } from "../store/auth";
import { useUi } from "../store/ui";
import { RouteTransition } from "./RouteTransition";

const NAV = [
  { to: "/", label: "Dashboard", icon: IconGrid, end: true },
  { to: "/stats", label: "Stats", icon: IconChart },
  { to: "/clients", label: "Clients", icon: IconPeople },
  { to: "/accounting", label: "Accounting", icon: IconLedger },
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
  const toggleChatbot = useUi((s) => s.toggleChatbot);
  const search = useUi((s) => s.search);
  const setSearch = useUi((s) => s.setSearch);
  const notifications = useUi((s) => s.notifications);

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

  const initials = (user?.name || "AG")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="app-shell">
      <aside ref={sidebarRef} className="app-sidebar">
        <div className="sidebar-header">
          <LogoMark size={28} />
          <span data-label className="sidebar-brand-text">
            TCA
          </span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon style={{ flexShrink: 0 }} />
                <span data-label style={{ whiteSpace: "nowrap" }}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={toggleChatbot}
            className="nav-link"
            style={{ marginTop: "4px", width: "100%", textAlign: "left" }}
          >
            <IconBot style={{ flexShrink: 0 }} />
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
            <button
              type="button"
              onClick={toggleSidebar}
              className="icon-btn"
              aria-label="Toggle sidebar"
            >
              <IconMenu />
            </button>
            <label className="search-bar">
              <span className="search-bar-icon">
                <IconSearch size={16} />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients, invoices…"
                className="search-bar-input"
              />
            </label>
          </div>

          <div className="header-right">
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="icon-btn"
                aria-label="Notifications"
              >
                <IconBell />
              </button>
              <span
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "8px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-accent-orange)",
                }}
              />
              <div className="sr-only">
                {notifications.map((n) => n.text).join(", ")}
              </div>
            </div>
            <div className="user-badge">
              <div className="avatar-circle">
                {initials || "AG"}
              </div>
              <div className="user-info-text">
                <p className="user-name">{user?.name || "Agent"}</p>
                <p className="user-role">{user?.role}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="btn-logout"
              >
                Logout
              </button>
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
      <WhatsAppFab />
    </div>
  );
}