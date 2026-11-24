import api from "./api";

export interface DirectMessage {
  id: string;
  patientUserId: string;
  doctorUserId: string;
  appointmentId?: string | null;
  senderRole: "PATIENT" | "DOCTOR";
  content: string;
  createdAt: string;
}

export interface ChatThread {
  peerId: string;
  name: string;
  subtitle: string;
  lastMessage: string;
  lastMessageAt: string | null;
  hasRelation?: boolean;
}

export const doctorChatService = {
  async getThreads(): Promise<ChatThread[]> {
    const res = await api.get("/doctor-chat/threads");
    return Array.isArray(res.data) ? res.data : res.data?.data || [];
  },

  async getMessages(peerId: string): Promise<DirectMessage[]> {
    const res = await api.get(`/doctor-chat/${peerId}`);
    return Array.isArray(res.data) ? res.data : res.data?.data || [];
  },

  async sendMessage(payload: {
    recipientId: string;
    content: string;
    appointmentId?: string;
  }): Promise<DirectMessage> {
    const res = await api.post("/doctor-chat", payload);
    return res.data?.data || res.data;
  },
};