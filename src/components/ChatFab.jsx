import { IconChat } from "./ui/Icons";
import { useUi } from "../store/ui";
import Magnet from "./ui/magnet";

export function ChatFab() {
  const toggleChatbot = useUi((s) => s.toggleChatbot);
  return (
    <div className="chat-fab-wrap">
      <Magnet padding={36} magnetStrength={12}>
        <button
          type="button"
          onClick={toggleChatbot}
          className="chat-fab"
          aria-label="Open assistant chat"
        >
          <IconChat size={22} />
        </button>
      </Magnet>
    </div>
  );
}
