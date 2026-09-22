import { WHATSAPP_URL } from "../lib/config";
import { IconWhatsApp } from "./ui/Icons";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-fab"
      aria-label="Open WhatsApp"
    >
      <IconWhatsApp size={22} />
    </a>
  );
}
