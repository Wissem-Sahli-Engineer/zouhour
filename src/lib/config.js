export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "21600000000";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Proxied by Vite to the FastAPI backend's /chat route (see vite.config.js)
export const CHAT_API_URL = "/api/chat";
export const CHAT_MODEL_LABEL = "Qwen2.5-VL 3B";
