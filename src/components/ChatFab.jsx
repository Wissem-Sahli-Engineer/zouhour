import { IconChat } from "./ui/Icons";
import { useUi } from "../store/ui";

export function ChatFab() {
  const toggleChatbot = useUi((s) => s.toggleChatbot);
  return (
    <button
      type="button"
      onClick={toggleChatbot}
      className="chat-fab"
      aria-label="Open assistant chat"
    >
      <IconChat size={22} />
    </button>
  );
}
