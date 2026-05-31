import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar') || null;
    return token ? { token, name, email, avatar } : null;
  });

  const loginUser = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    setUser({ ...data, avatar: localStorage.getItem('avatar') || null });
  };

  const updateAvatar = (avatar) => {
    localStorage.setItem('avatar', avatar);
    setUser(u => ({ ...u, avatar }));
  };

  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
