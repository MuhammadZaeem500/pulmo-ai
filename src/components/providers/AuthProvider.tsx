'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged, type User } from '@/lib/firebase';
import { getFirebaseAuth } from '@/lib/firebase';
import { authService, AuthUser } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('accessToken', token);
          localStorage.setItem('token', token);
          document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=86400`;
          document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=86400`;

          // If user object not yet in localStorage, create basic profile
          if (!localStorage.getItem('user')) {
            const roleCookie = document.cookie
              .split('; ')
              .find((row) => row.startsWith('userRole='))
              ?.split('=')[1];
            const profile: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName,
              role: (roleCookie ? decodeURIComponent(roleCookie) : 'PATIENT') as any,
            };
            localStorage.setItem('user', JSON.stringify(profile));
          }
        } catch (err) {
          console.error('Error auto-refreshing Firebase ID token:', err);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
