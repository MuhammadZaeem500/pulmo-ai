import api from '@/services/api';
import {
  getFirebaseAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
} from '@/lib/firebase';

export interface AuthUser {
  id?: string;
  uid?: string;
  email?: string | null;
  fullName?: string | null;
  role?: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'USER';
  [key: string]: any;
}

export interface LoginParams {
  email: string;
  password: string;
  expectedRole?: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export interface SocialLoginParams {
  expectedRole?: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export const authService = {
  /**
   * Synchronize auth tokens and roles across cookies and localStorage
   */
  setAuthSession(token: string, role?: string, user?: any) {
    if (typeof window === 'undefined') return;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);

    document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=86400`;
    document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=86400`;

    if (role) {
      const normalizedRole = String(role).toUpperCase();
      document.cookie = `userRole=${encodeURIComponent(normalizedRole)}; path=/; SameSite=Lax; max-age=86400`;
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.uid) {
        localStorage.setItem('firebaseUid', user.uid);
      }
    }
  },

  /**
   * Purge auth session completely from storage and cookies
   */
  clearAuthSession() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('firebaseUid');

    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'userRole=; path=/; max-age=0';
  },

  /**
   * Friendly error translation for Firebase Auth error codes and API errors
   */
  formatAuthError(error: any): string {
    if (!error) return 'An unexpected error occurred.';

    const code = error.code || '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please verify your credentials.';
      case 'auth/user-not-found':
        return 'No registered account found with this email.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      default:
        return (
          error.response?.data?.message ||
          error.message ||
          'Authentication failed. Please check your details and try again.'
        );
    }
  },

  /**
   * User login with Firebase Authentication and backend sync
   */
  async login({ email, password, expectedRole }: LoginParams) {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available.');
    }

    // 1. Authenticate against Firebase
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;
    const idToken = await firebaseUser.getIdToken();

    // 2. Synchronize with backend API
    let backendData: any = null;
    try {
      const response = await api.post(
        '/auth/sign-in',
        {
          email,
          password,
          idToken,
          firebaseUid: firebaseUser.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      backendData = response.data;
    } catch (err: any) {
      // If backend returns 401 or 403, bubble it up so portal-specific checks fail
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw err;
      }
      console.warn('Backend /auth/sign-in notice:', err?.response?.data || err?.message);
    }

    const role =
      backendData?.user?.role ||
      backendData?.role ||
      expectedRole ||
      'PATIENT';

    const activeToken = backendData?.accessToken || idToken;

    const userProfile: AuthUser = backendData?.user || {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: firebaseUser.displayName,
      role: role as any,
    };

    // 3. Persist session for middleware and API clients
    this.setAuthSession(activeToken, role, userProfile);

    return {
      user: userProfile,
      accessToken: activeToken,
      idToken,
      ...backendData,
    };
  },

  /**
   * Social login via Google
   */
  async loginWithGoogle(expectedRole: 'ADMIN' | 'DOCTOR' | 'PATIENT' = 'PATIENT') {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available.');
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    const firebaseUser = credential.user;
    const idToken = await firebaseUser.getIdToken();

    let backendData: any = null;
    try {
      const response = await api.post(
        '/auth/social-sync',
        {
          idToken,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: firebaseUser.displayName,
          role: expectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      backendData = response.data;
    } catch (err: any) {
      console.warn('Backend /auth/social-sync notice:', err?.response?.data || err?.message);
    }

    const role =
      backendData?.user?.role ||
      backendData?.role ||
      expectedRole;

    const activeToken = backendData?.accessToken || idToken;

    const userProfile: AuthUser = backendData?.user || {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: firebaseUser.displayName,
      role: role as any,
    };

    this.setAuthSession(activeToken, role, userProfile);

    return {
      user: userProfile,
      accessToken: activeToken,
      idToken,
      ...backendData,
    };
  },

  /**
   * Social login via GitHub
   */
  async loginWithGithub(expectedRole: 'ADMIN' | 'DOCTOR' | 'PATIENT' = 'PATIENT') {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available.');
    }

    const provider = new GithubAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const firebaseUser = credential.user;
    const idToken = await firebaseUser.getIdToken();

    let backendData: any = null;
    try {
      const response = await api.post(
        '/auth/social-sync',
        {
          idToken,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: firebaseUser.displayName,
          role: expectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      backendData = response.data;
    } catch (err: any) {
      console.warn('Backend /auth/social-sync notice:', err?.response?.data || err?.message);
    }

    const role =
      backendData?.user?.role ||
      backendData?.role ||
      expectedRole;

    const activeToken = backendData?.accessToken || idToken;

    const userProfile: AuthUser = backendData?.user || {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: firebaseUser.displayName,
      role: role as any,
    };

    this.setAuthSession(activeToken, role, userProfile);

    return {
      user: userProfile,
      accessToken: activeToken,
      idToken,
      ...backendData,
    };
  },

  /**
   * Register a new patient
   */
  async signupPatient(data: any) {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available.');
    }

    // 1. Create Firebase account
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = credential.user;

    // 2. Set Firebase displayName
    if (data.fullName) {
      try {
        await updateProfile(firebaseUser, { displayName: data.fullName });
      } catch (e) {
        console.warn('Could not update profile displayName:', e);
      }
    }

    const idToken = await firebaseUser.getIdToken();

    // Set initial session so the subsequent backend request includes bearer token
    this.setAuthSession(idToken, 'PATIENT', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: data.fullName,
      role: 'PATIENT',
    });

    // 3. Send profile to backend
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      age: data.age ? Number(data.age) : undefined,
      password: data.password,
      firebaseUid: firebaseUser.uid,
      idToken,
      role: 'PATIENT',
    };

    try {
      const response = await api.post('/auth/patient/sign-up', payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return response.data;
    } catch (err: any) {
      console.error('Backend patient signup error:', err);
      throw err;
    }
  },

  /**
   * Register a new doctor
   */
  async signupDoctor(data: any) {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available.');
    }

    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();

    // 1. Create Firebase account
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = credential.user;

    // 2. Set Firebase displayName
    if (fullName) {
      try {
        await updateProfile(firebaseUser, { displayName: fullName });
      } catch (e) {
        console.warn('Could not update profile displayName:', e);
      }
    }

    const idToken = await firebaseUser.getIdToken();

    this.setAuthSession(idToken, 'DOCTOR', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName,
      role: 'DOCTOR',
    });

    // 3. Send doctor profile to backend
    const payload = {
      fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      licenseNumber: data.pmdcNumber,
      specialty: data.specialty,
      specialization: data.specialty,
      hospital: data.hospital,
      qualifications: data.qualifications || '',
      experience: Number(data.experience) || 0,
      medicalRegNumber: data.medicalRegNumber || '',
      firebaseUid: firebaseUser.uid,
      idToken,
      role: 'DOCTOR',
    };

    try {
      const response = await api.post('/auth/doctor/sign-up', payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return response.data;
    } catch (err: any) {
      console.error('Backend doctor signup error:', err);
      throw err;
    }
  },

  /**
   * Register a new admin
   */
  async signupAdmin(data: any) {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available.');
    }

    // 1. Create Firebase account
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = credential.user;

    if (data.fullName) {
      try {
        await updateProfile(firebaseUser, { displayName: data.fullName });
      } catch (e) {
        console.warn('Could not update profile displayName:', e);
      }
    }

    const idToken = await firebaseUser.getIdToken();

    this.setAuthSession(idToken, 'ADMIN', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: data.fullName,
      role: 'ADMIN',
    });

    // 2. Send admin profile to backend
    const payload = {
      fullName: data.fullName,
      email: data.email,
      organization: data.organization,
      adminRole: data.role,
      password: data.password,
      firebaseUid: firebaseUser.uid,
      idToken,
      role: 'ADMIN',
    };

    try {
      const response = await api.post('/auth/admin/sign-up', payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return response.data;
    } catch (err: any) {
      console.error('Backend admin signup error:', err);
      throw err;
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available.');
    }
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Delete current authenticated user from Firebase Auth and clear storage
   */
  async deleteAccount() {
    try {
      const auth = getFirebaseAuth();
      if (auth && auth.currentUser) {
        await auth.currentUser.delete();
      }
    } catch (err) {
      console.warn('Firebase currentUser.delete notice:', err);
    } finally {
      this.clearAuthSession();
    }
  },

  /**
   * Log out current user from Firebase and clear browser auth storage
   */
  async logout() {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error('Error during Firebase signOut:', err);
    } finally {
      this.clearAuthSession();
    }
  },
};

export default authService;
