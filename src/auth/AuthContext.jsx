import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'kali_token';

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
function setStoredToken(t) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/* токентой fetch — Authorization header автоматаар нэмнэ */
export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (options.body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch {
    // сүлжээний алдаа — сервер унтарсан байж магадгүй
    throw new Error('Сервер рүү холбогдож чадсангүй. API сервер (npm run server) ажиллаж байгаа эсэхээ шалгана уу.');
  }

  // JSON биш хариу (ж: proxy 500 HTML) ирвэл
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (data?.error) throw new Error(data.error);
    if (res.status >= 500)
      throw new Error('Сервер алдаа (500). API сервер ажиллаж байгаа эсэхээ шалгана уу: npm run server');
    throw new Error(`Алдаа гарлаа (HTTP ${res.status})`);
  }
  return data ?? {};
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // эхлэхэд хадгалсан токеныг шалгана
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setReady(true);
      return;
    }
    apiFetch('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setStoredToken(null))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (username, password) => {
    const d = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setStoredToken(d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async (username, password) => {
    const d = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setStoredToken(d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
