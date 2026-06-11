import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { authAPI } from '../api';

/* ─── Storage Keys ─────────────────────────────────────────── */
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';
const PENDING_ACTION_KEY = 'pendingAction';

/* ─── requireAuth helper ───────────────────────────────────── */
/**
 * Saves an optional pending action to sessionStorage and redirects
 * the user to /login. Call this from any page that requires auth.
 *
 * @param {Function} navigate   - React Router navigate function
 * @param {object}   location   - React Router location object
 * @param {object}   [action]   - Optional action to replay after login
 *                               e.g. { type: 'addToCart', paintingId: 'abc' }
 * @param {string}   [message]  - Optional message shown on the login page
 */
export function requireAuth(navigate, location, action, message = 'Please log in to continue.') {
  if (action) {
    try {
      sessionStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
    } catch {
      // sessionStorage unavailable
    }
  }
  navigate('/login', { state: { from: location, message } });
}

/* ─── Helpers ──────────────────────────────────────────────── */
function loadAuthFromStorage() {
  try {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { token, user };
    }
    return null;
  } catch {
    return null;
  }
}

function getAuthStorage() {
  if (localStorage.getItem(TOKEN_KEY)) return localStorage;
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  return localStorage;
}

function saveAuthToStorage(token, user, remember = true) {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));

    if (remember) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Storage unavailable
  }
}

function clearAuthStorage() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {
    // Fail silently
  }
}

/* ─── Context ──────────────────────────────────────────────── */
const AuthContext = createContext(null);

/* ─── Provider ─────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const stored = loadAuthFromStorage();
    return stored
      ? { isAuthenticated: true, user: stored.user, token: stored.token }
      : { isAuthenticated: false, user: null, token: null };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Register a new user
   */
  const register = useCallback(async (name, email, phone, password, confirmPassword, remember = true) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        // If backend requires email verification, don't auto-login
        if (response.data.requiresVerification) {
          return { success: true, requiresVerification: true, message: response.data.message };
        }
        const { token, user } = response.data;
        saveAuthToStorage(token, user, remember);
        setAuthState({ isAuthenticated: true, user, token });
        return { success: true, user };
      }

      return { success: false, error: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password, remember = true) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);

      if (response.data.success) {
        const { token, user } = response.data;
        saveAuthToStorage(token, user, remember);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });

        // Retrieve and clear any pending action saved before redirect
        let pendingAction = null;
        try {
          const raw = sessionStorage.getItem(PENDING_ACTION_KEY);
          if (raw) {
            pendingAction = JSON.parse(raw);
            sessionStorage.removeItem(PENDING_ACTION_KEY);
          }
        } catch {
          // Fail silently
        }

        return { success: true, user, pendingAction };
      }

      return { success: false, error: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const loginWithGoogle = useCallback(async (token, remember = true) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.googleLogin(token);
      if (response.data.success) {
        const { token: jwtToken, user } = response.data;
        saveAuthToStorage(jwtToken, user, remember);
        setAuthState({ isAuthenticated: true, user, token: jwtToken });
        return { success: true, user };
      }
      return { success: false, message: 'Google login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to authenticate with Google';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithFacebook = useCallback(async (token, remember = true) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.facebookLogin(token);
      if (response.data.success) {
        const { token: jwtToken, user } = response.data;
        saveAuthToStorage(jwtToken, user, remember);
        setAuthState({ isAuthenticated: true, user, token: jwtToken });
        return { success: true, user };
      }
      return { success: false, message: 'Facebook login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to authenticate with Facebook';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (authState.token) {
        await authAPI.logout();
      }
    } catch {
      // Fail silently
    } finally {
      clearAuthStorage();
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
      setError(null);
    }
  }, [authState.token]);

  /**
   * Get current user profile
   */
  const getProfile = useCallback(async () => {
    if (!authState.token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await authAPI.getProfile();

      if (response.data.success) {
        const user = response.data.user;
        saveAuthToStorage(authState.token, user, getAuthStorage() === localStorage);
        setAuthState((prev) => ({
          ...prev,
          user,
        }));
        return { success: true, user };
      }

      return { success: false, error: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [authState.token]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (updates) => {
      if (!authState.token) {
        return { success: false, error: 'Not authenticated' };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await authAPI.updateProfile(updates);

        if (response.data.success) {
          const user = response.data.user;
          saveAuthToStorage(authState.token, user, getAuthStorage() === localStorage);
          setAuthState((prev) => ({
            ...prev,
            user,
          }));
          return { success: true, user };
        }

        return { success: false, error: response.data.message };
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Profile update failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [authState.token]
  );

  // Context value
  const value = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      token: authState.token,
      loading,
      error,
      register,
      login,
      logout,
      loginWithGoogle,
      loginWithFacebook,
      getProfile,
      updateProfile,
    }),
    [authState, loading, error, register, login, logout, loginWithGoogle, loginWithFacebook, getProfile, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─── Hook ─────────────────────────────────────────────────── */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

export default AuthContext;
