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
    <div className="flex h-full overflow-hidden bg-surface">
      <aside
        ref={sidebarRef}
        className="relative z-20 flex h-full w-[232px] shrink-0 flex-col overflow-hidden border-r border-line bg-white"
      >
        <div className="flex h-[70px] items-center gap-3 px-5">
          <LogoMark size={28} />
          <span data-label className="whitespace-nowrap text-[15px] font-bold text-ink">
            TCA
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 rounded-nav px-3 text-[13.5px] font-semibold transition-colors ${
                    isActive ? "bg-brand-wash text-brand" : "text-muted hover:bg-[#f0f0f4] hover:text-ink"
                  }`
                }
              >
                <Icon className="shrink-0" />
                <span data-label className="whitespace-nowrap">
                  {item.label}
                </span>
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={toggleChatbot}
            className="mt-1 flex h-11 items-center gap-3 rounded-nav px-3 text-left text-[13.5px] font-semibold text-muted hover:bg-[#f0f0f4] hover:text-ink"
          >
            <IconBot className="shrink-0" />
            <span data-label className="whitespace-nowrap">
              AI Chatbot
            </span>
          </button>
        </nav>

        <p data-label className="px-5 pb-5 text-[11px] leading-relaxed text-muted">
          Visa operations
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 flex h-[70px] shrink-0 items-center justify-between gap-4 bg-white px-8 shadow-bar">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-nav text-ink hover:bg-[#f0f0f4]"
              aria-label="Toggle sidebar"
            >
              <IconMenu />
            </button>
            <label className="relative hidden min-w-[240px] max-w-md flex-1 md:block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <IconSearch size={16} />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients, invoices…"
                className="w-full rounded-btn border-0 bg-surface py-2.5 pl-10 pr-3 text-body text-ink outline-none placeholder:text-muted"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-nav text-ink hover:bg-[#f0f0f4]"
                aria-label="Notifications"
              >
                <IconBell />
              </button>
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-orange" />
              <div className="sr-only">
                {notifications.map((n) => n.text).join(", ")}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-brand text-[14px] font-bold text-white">
                {initials || "AG"}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-[13px] font-semibold capitalize text-ink">{user?.name || "Agent"}</p>
                <p className="text-[11px] text-muted">{user?.role}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-[10px] bg-[#fee2e2] px-3.5 py-2 text-[13px] font-semibold text-[#ef4444] hover:bg-[#fca5a5]"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
          <div className="px-8 py-8">
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