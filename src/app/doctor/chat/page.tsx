import { Suspense } from "react";
import ChatWorkspace from "@/components/chat/ChatWorkspace";

export default function DoctorChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatWorkspace role="DOCTOR" title="Patient Messages" peerLabel="Patient" />
    </Suspense>
  );
}