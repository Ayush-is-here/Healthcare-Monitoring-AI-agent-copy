import { AppShell } from "@/components/layout/AppShell";
import { ChatShell } from "@/features/chat/components/ChatShell";

export function ChatView() {
  return (
    <AppShell>
      <ChatShell />
    </AppShell>
  );
}
