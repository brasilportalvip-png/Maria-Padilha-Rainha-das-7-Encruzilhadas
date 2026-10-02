import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, ReadingHistory, DiaryEntry } from '../types/spiritual.js';
import { auth, db } from '../firebase/firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, doc, getDoc, setDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

interface AppContextType {
  user: UserProfile | null;
  history: ReadingHistory[];
  diary: DiaryEntry[];
  isAuthenticating: boolean;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    birthTime?: string;
    city: string;
    password: string;
    timezone?: string;
  }) => Promise<UserProfile>;
  login: (email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getAuthToken: () => Promise<string>;
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>;
  setUserCredits: (credits: number) => void;
  spendCredits: (amount: number, type: string, title?: string, content?: any) => Promise<boolean>;
  addHistoryItem: (item: ReadingHistory) => void;
  addDiaryEntry: (title: string, content: string, category: DiaryEntry['category']) => Promise<void>;
  deleteDiaryEntry: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Helper to get fresh Firebase ID token strictly from active Firebase Auth session
  const getAuthToken = useCallback(async (): Promise<string> => {
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(false);
        if (token) return token;
      }
    } catch (e) {
      console.warn('[AppContext] getIdToken failed:', e);
    }
    return '';
  }, []);

  // Authenticated fetch wrapper
  const apiFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = await getAuthToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(url, { ...options, headers });
  }, [getAuthToken]);

  // Load user data on startup strictly via Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const profile = snap.data() as UserProfile;
            setUser(profile);
            loadUserData(profile.uid);
            return;
          }
        } catch (err) {
          console.warn('[AppContext] Firestore getDoc failed on auth state change:', err);
        }
      } else {
        setUser(null);
        setHistory([]);
        setDiary([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    // 1. Load History
    try {
      const histSnap = await getDocs(query(collection(db, 'readings'), where('uid', '==', uid)));
      if (!histSnap.empty) {
        const list: ReadingHistory[] = histSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: uid,
            type: data.oracleType || 'tarot',
            title: `Consulta de ${data.oracleType || 'Oráculo'}`,
            date: data.createdAt || new Date().toISOString(),
            content: data.interpretationHtml,
            creditsUsed: data.creditCost || 1,
            readingRecord: data as any,
          };
        });
        setHistory(list);
      } else {
        const cached = localStorage.getItem(`mp_history_${uid}`);
        if (cached) setHistory(JSON.parse(cached));
      }
    } catch {
      const cached = localStorage.getItem(`mp_history_${uid}`);
      if (cached) setHistory(JSON.parse(cached));
    }

    // 2. Load Diary
    try {
      const diarySnap = await getDocs(query(collection(db, 'diary'), where('userId', '==', uid)));
      if (!diarySnap.empty) {
        const list: DiaryEntry[] = diarySnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<DiaryEntry, 'id'>),
        }));
        setDiary(list);
      } else {
        const cached = localStorage.getItem(`mp_diary_${uid}`);
        if (cached) setDiary(JSON.parse(cached));
      }
    } catch {
      const cached = localStorage.getItem(`mp_diary_${uid}`);
      if (cached) setDiary(JSON.parse(cached));
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    birthTime?: string;
    city: string;
    password: string;
    timezone?: string;
  }): Promise<UserProfile> => {
    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Falha ao realizar cadastro.');
      }

      const newUser: UserProfile = result.user;

      // Automatically sign in with client SDK to establish authentic Firebase session
      try {
        await signInWithEmailAndPassword(auth, data.email.trim(), data.password);
      } catch (authErr) {
        console.warn('[AppContext] Client auto-login after register failed:', authErr);
      }

      setUser(newUser);
      await loadUserData(newUser.uid);
      return newUser;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setIsAuthenticating(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userDocRef = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        throw new Error('Perfil de usuário não encontrado no Firestore. Contate o suporte.');
      }

      const loggedUser = snap.data() as UserProfile;

      if (loggedUser.isBlocked) {
        await signOut(auth);
        throw new Error('Esta conta foi bloqueada por razões de segurança.');
      }

      setUser(loggedUser);
      await loadUserData(loggedUser.uid);
      return loggedUser;
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('E-mail ou senha incorretos.');
      }
      throw new Error(err.message || 'Falha ao autenticar.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setUser(null);
    setHistory([]);
    setDiary([]);
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!email) throw new Error('Por favor, informe seu e-mail cadastrado.');
    await sendPasswordResetEmail(auth, email.trim());
  };

  const setUserCredits = (credits: number) => {
    if (!user) return;
    const updated = { ...user, credits };
    setUser(updated);
  };

  const spendCredits = async (amount: number, type: string, title?: string, content?: any): Promise<boolean> => {
    if (!user || user.credits < amount) return false;
    const newBal = user.credits - amount;
    setUserCredits(newBal);

    if (title) {
      addHistoryItem({
        id: `reading_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: user.uid,
        type,
        title,
        date: new Date().toISOString(),
        content: content || {},
        creditsUsed: amount,
      });
    }
    return true;
  };

  const addHistoryItem = (item: ReadingHistory) => {
    const nextHistory = [item, ...history];
    setHistory(nextHistory);
    if (user) {
      localStorage.setItem(`mp_history_${user.uid}`, JSON.stringify(nextHistory));
    }
  };

  const addDiaryEntry = async (title: string, content: string, category: DiaryEntry['category']) => {
    if (!user) return;
    const entryId = `diary_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEntry: DiaryEntry = {
      id: entryId,
      userId: user.uid,
      title,
      content,
      category,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const nextDiary = [newEntry, ...diary];
    setDiary(nextDiary);
    localStorage.setItem(`mp_diary_${user.uid}`, JSON.stringify(nextDiary));

    try {
      await setDoc(doc(db, 'diary', entryId), newEntry);
    } catch (e) {
      console.warn('Could not sync diary to Firestore, stored locally:', e);
    }
  };

  const deleteDiaryEntry = async (id: string) => {
    if (!user) return;
    const nextDiary = diary.filter((d) => d.id !== id);
    setDiary(nextDiary);
    localStorage.setItem(`mp_diary_${user.uid}`, JSON.stringify(nextDiary));

    try {
      await deleteDoc(doc(db, 'diary', id));
    } catch (e) {
      console.warn('Could not delete diary from Firestore:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        history,
        diary,
        isAuthenticating,
        register,
        login,
        logout,
        resetPassword,
        getAuthToken,
        apiFetch,
        setUserCredits,
        spendCredits,
        addHistoryItem,
        addDiaryEntry,
        deleteDiaryEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};
