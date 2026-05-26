import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

/* ─── Demo credentials ─────────────────────────────────────────── */
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'mithila2024';
const STORAGE_KEY = 'mithilaArt_auth';

/* ─── Helpers ──────────────────────────────────────────────────── */
function loadAuthFromSession() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.isAuthenticated ? parsed : null;
    }
    return null;
  } catch {
    return null;
  }
}

function saveAuthToSession(authState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  } catch {
    // Session storage unavailable — fail silently
  }
}

function clearAuthSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
}

/* ─── Context ──────────────────────────────────────────────────── */
const AuthContext = createContext(null);

/* ─── Provider ─────────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const stored = loadAuthFromSession();
    return (
      stored || {
        isAuthenticated: false,
        user: null,
      }
    );
  });

  // Sync to sessionStorage whenever authState changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      saveAuthToSession(authState);
    } else {
      clearAuthSession();
    }
  }, [authState]);

  /**
   * Attempt login with username and password.
   * @returns {{ success: boolean, error?: string }}
   */
  const login = useCallback((username, password) => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      const newState = {
        isAuthenticated: true,
        user: {
          username: DEMO_USERNAME,
          name: 'Admin',
          role: 'admin',
          loginTime: new Date().toISOString(),
        },
      };
      setAuthState(newState);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid username or password. Please try again.',
    };
  }, []);

  /**
   * Log the current user out.
   */
  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false, user: null });
    clearAuthSession();
  }, []);

  // ── Context value ──────────────────────────────────────────────
  const value = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      login,
      logout,
    }),
    [authState, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─── Hook ─────────────────────────────────────────────────────── */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

export default AuthContext;
