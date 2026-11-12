import api from "@/services/api";

// inside your existing api.ts
export async function fetchSecurityDashboardData() {
    // Use your project's existing API instance (e.g., axios or custom fetch wrapper)
    const response = await api.get('/admin/security/dashboard');
    return response.data;
}

export async function fetchAdminReportsData() {
    const response = await api.get('/admin/reports/dashboard');
    return response.data;
}

export async function fetchAdminNotifications() {
  const response = await api.get('/admin/notifications');
  return response.data;
}