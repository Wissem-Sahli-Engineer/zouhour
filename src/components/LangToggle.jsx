import { useI18n } from "../store/i18n";
import Magnet from "./ui/magnet";

export function LangToggle() {
  const lang = useI18n((s) => s.lang);
  const toggle = useI18n((s) => s.toggle);
  const isAr = lang === "ar";

  return (
    <Magnet padding={22} magnetStrength={14}>
      <button
        type="button"
        onClick={toggle}
        className="icon-btn"
        aria-label="Toggle Arabic / English"
        title="Toggle Arabic / English"
        style={{ fontSize: "12px", fontWeight: "700" }}
      >
        {isAr ? "EN" : "ع"}
      </button>
    </Magnet>
  );
}
