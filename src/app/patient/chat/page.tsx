import { Suspense } from "react";
import ChatWorkspace from "@/components/chat/ChatWorkspace";

export default function PatientChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatWorkspace role="PATIENT" title="Chat with Doctors" peerLabel="Doctor" />
    </Suspense>
  );
}