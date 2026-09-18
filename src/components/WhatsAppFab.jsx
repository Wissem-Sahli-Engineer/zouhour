import { WHATSAPP_URL } from "../lib/config";
import { IconWhatsApp } from "./ui/Icons";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:brightness-95"
      aria-label="Open WhatsApp"
    >
      <IconWhatsApp size={22} />
    </a>
  );
}
