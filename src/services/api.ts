import axios, { AxiosRequestConfig } from 'axios';
import { getFirebaseAuth } from '@/lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function resolveBearerToken(forceRefresh = false): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const auth = getFirebaseAuth();
    if (auth) {
      // Wait for Firebase to finish restoring authenticated user from storage
      if (typeof (auth as any).authStateReady === 'function') {
        await (auth as any).authStateReady();
      }
      const currentUser = auth.currentUser;
      if (currentUser) {
        // getIdToken automatically returns a fresh token using the Firebase refresh token
        const firebaseToken = await currentUser.getIdToken(forceRefresh);
        if (firebaseToken) {
          localStorage.setItem('accessToken', firebaseToken);
          localStorage.setItem('token', firebaseToken);
          return firebaseToken;
        }
      }
    }
  } catch {
    // Fall back to stored token if Firebase is not active
  }

  return localStorage.getItem('accessToken') || localStorage.getItem('token');
}

api.interceptors.request.use(
  async (config) => {
    const token = await resolveBearerToken(false);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (typeof window !== 'undefined' && error.response?.status === 401) {
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const auth = getFirebaseAuth();
          if (auth?.currentUser) {
            const refreshedToken = await auth.currentUser.getIdToken(true);
            if (refreshedToken) {
              localStorage.setItem('accessToken', refreshedToken);
              localStorage.setItem('token', refreshedToken);
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${refreshedToken}`,
              };
              return api(originalRequest);
            }
          }
        } catch (err) {
          console.error('Token refresh failed:', err);
          // Token refresh failed; clear auth state below
        }
      }

      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('firebaseUid');
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'token=; path=/; max-age=0';
      document.cookie = 'userRole=; path=/; max-age=0';
    }

    return Promise.reject(error);
  },
);

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  retryOn401 = true,
): Promise<T> {
  const auth = getFirebaseAuth();
  const currentUser = auth?.currentUser;

  if (!currentUser) {
    throw new Error('Not authenticated with Firebase');
  }

  const idToken = await currentUser.getIdToken(false);

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${idToken}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && retryOn401) {
    await currentUser.getIdToken(true);
    return apiFetch<T>(path, init, false);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export default api;
