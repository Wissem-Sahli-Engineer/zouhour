import { useTheme } from "../store/theme";
import { IconSun, IconMoon } from "./ui/Icons";
import Magnet from "./ui/magnet";

export function ThemeToggle() {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  const isDark = theme === "dark";

  return (
    <Magnet padding={22} magnetStrength={14}>
      <button
        type="button"
        onClick={toggle}
        className="icon-btn"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {isDark ? <IconMoon size={17} /> : <IconSun size={17} />}
      </button>
    </Magnet>
  );
}
