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
      // Store user ID for user-specific preferences (theme, sidebar, etc.)
      if (user.id) {
        localStorage.setItem('userId', user.id);
      } else if (user.uid) {
        localStorage.setItem('userId', user.uid);
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
    localStorage.removeItem('userId');

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
    const message = error.response?.data?.message || error.message || '';

    // Check for "user not found" in various places
    const isUserNotFound =
      code === 'auth/user-not-found' ||
      message.toLowerCase().includes('user not found') ||
      message.toLowerCase().includes('account does not exist') ||
      message.toLowerCase().includes('account was deleted') ||
      (error.response?.status === 400 && message.includes('User not found'));

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please verify your credentials.';
      case 'auth/user-not-found':
        return '❌ Account Does Not Exist\n\nThis email is not registered. The account may have been deleted.\n\nPlease check your email address or sign up for a new account.';
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
        // If we detected user not found in the message
        if (isUserNotFound) {
          return '❌ Account Does Not Exist\n\nThis account has been deleted or no longer exists.\n\nPlease check your email address or sign up for a new account.';
        }
        return (
          message ||
          'Authentication failed. Please check your details and try again.'
        );
    }
  },

  /**
   * User login with Firebase Authentication and backend sync
   */
  async login({ email, password, expectedRole }: LoginParams) {
    const auth = getFirebaseAuth();
    let firebaseUser: any = null;
    let idToken = '';
    let firebaseAuthError: any = null;

    if (auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = credential.user;
        idToken = await firebaseUser.getIdToken();
      } catch (err: any) {
        const code = err?.code || '';
        const canFallbackToBackend =
          code === 'auth/invalid-credential' ||
          code === 'auth/user-not-found' ||
          code === 'auth/wrong-password';
        if (!canFallbackToBackend) {
          throw err;
        }
        firebaseAuthError = err;
      }
    }

    // 2. Synchronize / authenticate with backend API
    let backendData: any = null;
    try {
      const response = await api.post(
        '/auth/sign-in',
        {
          email,
          password,
          ...(idToken ? { idToken } : {}),
          ...(firebaseUser?.uid ? { firebaseUid: firebaseUser.uid } : {}),
          ...(expectedRole ? { expectedRole } : {}),
        },
        idToken
          ? {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          : undefined,
      );
      backendData = response.data;
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw firebaseAuthError && !err.response?.data?.message ? firebaseAuthError : err;
      }
      if (!firebaseUser) {
        throw firebaseAuthError || err;
      }
      console.warn('Backend /auth/sign-in notice:', err?.response?.data || err?.message);
    }

    const role =
      backendData?.user?.role ||
      backendData?.role ||
      expectedRole ||
      'PATIENT';

    const activeToken = idToken || backendData?.accessToken;
    if (!activeToken) {
      throw firebaseAuthError || new Error('Authentication failed.');
    }

    const userProfile: AuthUser = backendData?.user || {
      id: firebaseUser?.uid,
      uid: firebaseUser?.uid,
      email: firebaseUser?.email || email,
      fullName: firebaseUser?.displayName || email.split('@')[0],
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
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw err;
      }
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
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw err;
      }
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
   * Upload a single doctor verification document to backend.
   * Returns the URL path or falls back to base64 data URL.
   */
  async uploadDoctorDocument(file: File, idToken: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/auth/doctor/upload-document', formData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.url || '';
    } catch (err) {
      console.warn('File upload failed, falling back to base64:', err);
      // Fallback: convert to base64 data URL
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * Register a new doctor with verification documents
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

    // 3. Upload verification documents in parallel
    const [cnicFrontUrl, cnicBackUrl, practiceLicenseUrl, pmdcCertificateUrl] =
      await Promise.all([
        data.cnicFront instanceof File
          ? this.uploadDoctorDocument(data.cnicFront, idToken)
          : Promise.resolve(null),
        data.cnicBack instanceof File
          ? this.uploadDoctorDocument(data.cnicBack, idToken)
          : Promise.resolve(null),
        data.practiceLicense instanceof File
          ? this.uploadDoctorDocument(data.practiceLicense, idToken)
          : Promise.resolve(null),
        data.pmdcCertificate instanceof File
          ? this.uploadDoctorDocument(data.pmdcCertificate, idToken)
          : Promise.resolve(null),
      ]);

    // 4. Send doctor profile to backend with document URLs
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
      cnicFrontUrl,
      cnicBackUrl,
      practiceLicenseUrl,
      pmdcCertificateUrl,
    };

    try {
      const response = await api.post('/auth/doctor/sign-up', payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // Clear auth session after signup — doctor must wait for admin approval
      this.clearAuthSession();

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
