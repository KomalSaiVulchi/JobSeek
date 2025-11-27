import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('jobseek_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
          });
        } else {
          localStorage.removeItem('jobseek_token');
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('jobseek_token');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('jobseek_token', data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const signup = async (email, password, name, role) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('jobseek_token', data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jobseek_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
