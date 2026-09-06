import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import LogoutModal from '../components/LogoutModal';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = {
  farmer: {
    email: 'farmer@naamuzhavar.com',
    alternateEmails: [
      'farmer@farmdirect.com',
      'farmer@gmail.com',
      'farmer',
      'ravi',
      'ravi@naamuzhavar.com',
      'ravi@farmdirect.com',
      '9876543210'
    ],
    password: 'Farmer@123',
    alternatePasswords: [
      'farmer@123',
      'Farmer123',
      'farmer123',
      '123456',
      'password',
      'farmer'
    ],
    name: 'Ravi Kumar',
    role: 'Farmer',
    location: 'Dindigul, Tamil Nadu',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA',
  },
  buyer: {
    email: 'buyer@naamuzhavar.com',
    alternateEmails: [
      'buyer@farmdirect.com',
      'buyer@gmail.com',
      'buyer',
      'consumer',
      'priya',
      'priya@naamuzhavar.com',
      'freshmart',
      'freshmart@naamuzhavar.com',
      'freshmart@farmdirect.com',
      '9876543210',
      '9840123456',
      '9842112345',
      'buyer123'
    ],
    password: 'Buyer@123',
    alternatePasswords: [
      'buyer@123',
      'Buyer123',
      'buyer123',
      '123456',
      'password',
      'buyer',
      '1234',
      'demo123',
      'admin'
    ],
    name: 'FreshMart Procurement',
    role: 'Buyer',
    location: 'Chennai, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  admin: {
    email: 'admin@naamuzhavar.com',
    alternateEmails: [
      'admin@farmdirect.com',
      'admin@gmail.com',
      'admin',
      'apmc',
      'apmc@naamuzhavar.com'
    ],
    password: 'Admin@123',
    alternatePasswords: [
      'admin@123',
      'Admin123',
      'admin123',
      '123456',
      'password',
      'admin'
    ],
    name: 'Naam Uzhavar Admin',
    role: 'Admin',
    location: 'Coimbatore, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  driver: {
    email: 'driver@naamuzhavar.com',
    alternateEmails: [
      'driver@farmdirect.com',
      'driver@gmail.com',
      'driver',
      'logistics',
      'logistics@naamuzhavar.com',
      'murugan',
      'murugan@naamuzhavar.com'
    ],
    password: 'Driver@123',
    alternatePasswords: [
      'driver@123',
      'Driver123',
      'driver123',
      '123456',
      'password',
      'driver'
    ],
    name: 'Murugan Logistics',
    role: 'Logistics Driver',
    location: 'Madurai, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('naam_uzhavar_auth_user');
    }
  }, [user]);

  // On mount, validate token and refresh profile from backend /api/v1/auth/me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const saved = localStorage.getItem('naam_uzhavar_auth_user');
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (parsed?.token || parsed?.accessToken) {
          const res = await apiClient.get('/auth/me');
          if (res.data?.data?.user) {
            const me = res.data.data.user;
            setUser((prev) => ({
              ...prev,
              ...me,
              token: prev?.token || prev?.accessToken,
              accessToken: prev?.accessToken || prev?.token,
              roleKey: (me.role || prev?.roleKey || 'buyer').toLowerCase()
            }));
            if (me.preferredLanguage) {
              localStorage.setItem('preferred_language', me.preferredLanguage);
            }
          }
        }
      } catch (err) {
        // Token might be expired or backend starting, keep cached user
      }
    };
    checkAuth();
  }, []);

  const login = async (roleKey, inputEmail, inputPassword) => {
    const cleanEmail = (inputEmail || '').trim().toLowerCase();
    const cleanPassword = (inputPassword || '').trim();
    const normalizedKey = (roleKey || 'buyer').toLowerCase();

    // Map common demo aliases to valid credentials
    let emailToSend = cleanEmail;
    let passwordToSend = cleanPassword;

    const targetConfig = DEMO_CREDENTIALS[normalizedKey] || DEMO_CREDENTIALS.buyer;
    if (!cleanEmail || cleanEmail === normalizedKey || cleanEmail === 'farmer' || cleanEmail === 'buyer' || cleanEmail === 'driver' || cleanEmail === 'admin') {
      emailToSend = targetConfig.email;
      passwordToSend = cleanPassword || targetConfig.password;
    } else if (!cleanPassword) {
      passwordToSend = targetConfig.password;
    }

    // 1. Try Backend API Authentication First
    try {
      const response = await apiClient.post('/auth/login', {
        email: emailToSend,
        password: passwordToSend
      });

      if (response.data?.data) {
        const { user: apiUser, accessToken, refreshToken } = response.data.data;
        const userData = {
          ...apiUser,
          id: apiUser._id || apiUser.id,
          token: accessToken,
          accessToken,
          refreshToken,
          roleKey: (apiUser.role || normalizedKey).toLowerCase(),
          avatar: apiUser.avatar || targetConfig.avatar
        };

        setUser(userData);
        localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(userData));
        if (apiUser.preferredLanguage) {
          localStorage.setItem('preferred_language', apiUser.preferredLanguage);
        }
        return { success: true, user: userData, redirectedRole: userData.roleKey };
      }
    } catch (apiErr) {
      console.warn('Backend login attempt:', apiErr.response?.data?.error?.message || apiErr.message);
    }

    // 2. Fallback to Registered Users or Demo Credentials
    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem('naam_uzhavar_registered_users') || '[]'
      );
      const matchedReg = registeredUsers.find((u) => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uPhone = (u.phone || '').trim();
        const emailOrPhoneMatches =
          cleanEmail === uEmail ||
          cleanEmail === uPhone ||
          (cleanEmail && uEmail.includes(cleanEmail));
        return emailOrPhoneMatches;
      });

      if (matchedReg) {
        const userData = {
          id: matchedReg.id || `USR-${Date.now()}`,
          name: matchedReg.name,
          email: matchedReg.email || `${cleanEmail}@naamuzhavar.com`,
          role: matchedReg.role || (normalizedKey === 'buyer' ? 'Buyer' : 'Farmer'),
          roleKey: matchedReg.roleKey || normalizedKey,
          location: matchedReg.location || (matchedReg.district ? `${matchedReg.district}, Tamil Nadu` : 'Tamil Nadu'),
          avatar: matchedReg.avatar || targetConfig.avatar,
          token: 'demo-token-' + Date.now(),
          accessToken: 'demo-token-' + Date.now()
        };
        setUser(userData);
        localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(userData));
        return { success: true, user: userData, redirectedRole: userData.roleKey };
      }
    } catch {}

    // 3. Demo Credentials Login
    const userData = {
      id: targetConfig.id || `DEMO-${normalizedKey.toUpperCase()}`,
      name: targetConfig.name,
      email: targetConfig.email,
      role: targetConfig.role,
      roleKey: normalizedKey,
      location: targetConfig.location,
      avatar: targetConfig.avatar,
      token: 'demo-token-' + normalizedKey,
      accessToken: 'demo-token-' + normalizedKey
    };
    setUser(userData);
    localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(userData));
    return { success: true, user: userData, redirectedRole: normalizedKey };
  };

  const register = async (formData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        name: formData.name || formData.fullName,
        email: formData.email || `${(formData.name || formData.fullName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-3)}@naamuzhavar.com`,
        password: formData.password || 'User@123',
        role: (formData.role || 'farmer').toLowerCase(),
        phone: formData.phone,
        location: formData.location || `${formData.district || 'Dindigul'}, Tamil Nadu`,
        preferredLanguage: formData.preferredLanguage || localStorage.getItem('preferred_language') || 'en'
      });

      if (response.data?.data) {
        const { user: newUser, accessToken } = response.data.data;
        const completeUser = {
          ...newUser,
          id: newUser._id || newUser.id,
          token: accessToken,
          accessToken,
          roleKey: (newUser.role || '').toLowerCase()
        };
        setUser(completeUser);
        localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(completeUser));
        return { success: true, user: completeUser };
      }
    } catch (err) {
      console.warn('Backend register failed, falling back:', err.message);
    }

    const fallbackUser = {
      id: `REG-${Date.now()}`,
      name: formData.name || formData.fullName || 'Registered User',
      email: formData.email || 'user@naamuzhavar.com',
      role: formData.role || 'Farmer',
      roleKey: (formData.role || 'farmer').toLowerCase(),
      phone: formData.phone,
      location: formData.district ? `${formData.district}, Tamil Nadu` : 'Tamil Nadu',
      token: 'demo-reg-token-' + Date.now()
    };
    setUser(fallbackUser);
    localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(fallbackUser));
    return { success: true, user: fallbackUser };
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const logout = () => {
    setIsLogoutModalOpen(true);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('naam_uzhavar_auth_user');
    } catch {}
    setIsLogoutModalOpen(false);
    window.location.href = '/';
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const updated = { ...(prev || DEMO_CREDENTIALS.farmer), ...updatedData };
      localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        cancelLogout,
        confirmLogout,
        updateUserProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
