import React, { createContext, useContext, useState, useEffect } from 'react';

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
    location: 'Erode, Tamil Nadu',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA',
  },
  buyer: {
    email: 'buyer@naamuzhavar.com',
    alternateEmails: [
      'buyer@farmdirect.com',
      'buyer@gmail.com',
      'buyer',
      'freshmart',
      'freshmart@naamuzhavar.com',
      'freshmart@farmdirect.com'
    ],
    password: 'Buyer@123',
    alternatePasswords: [
      'buyer@123',
      'Buyer123',
      'buyer123',
      '123456',
      'password',
      'buyer'
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
    const saved = localStorage.getItem('naam_uzhavar_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('naam_uzhavar_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('naam_uzhavar_auth_user');
    }
  }, [user]);

  const login = (roleKey, inputEmail, inputPassword) => {
    const cleanEmail = (inputEmail || '').trim().toLowerCase();
    const cleanPassword = (inputPassword || '').trim();

    // Helper to check if credentials match a role
    const matchesRole = (config) => {
      const emailMatches =
        cleanEmail === config.email.toLowerCase() ||
        (config.alternateEmails &&
          config.alternateEmails.some((e) => e.toLowerCase() === cleanEmail)) ||
        cleanEmail.includes('farmer') ||
        cleanEmail.includes('ravi');

      const passwordMatches =
        !cleanPassword || // If left blank in dev demo
        cleanPassword === config.password ||
        cleanPassword.toLowerCase() === config.password.toLowerCase() ||
        (config.alternatePasswords &&
          config.alternatePasswords.some(
            (p) => p.toLowerCase() === cleanPassword.toLowerCase()
          ));

      return emailMatches && passwordMatches;
    };

    // 1. Try specified roleKey
    const normalizedKey = (roleKey || 'farmer').toLowerCase();
    let targetConfig = DEMO_CREDENTIALS[normalizedKey];

    if (targetConfig && matchesRole(targetConfig)) {
      const userData = {
        name: targetConfig.name,
        email: targetConfig.email,
        role: targetConfig.role,
        roleKey: normalizedKey,
        location: targetConfig.location,
        avatar: targetConfig.avatar,
      };
      setUser(userData);
      return { success: true, user: userData };
    }

    // 2. Fallback: check across all roles in case user entered farmer credentials on a different role form
    for (const [key, config] of Object.entries(DEMO_CREDENTIALS)) {
      if (matchesRole(config)) {
        const userData = {
          name: config.name,
          email: config.email,
          role: config.role,
          roleKey: key,
          location: config.location,
          avatar: config.avatar,
        };
        setUser(userData);
        return { success: true, user: userData, redirectedRole: key };
      }
    }

    // 3. Ultra-lenient fallback for farmer: if role is farmer and email contains farmer or ravi, accept it
    if (normalizedKey === 'farmer' && (cleanEmail.includes('farmer') || cleanEmail.includes('ravi') || !cleanEmail)) {
      const config = DEMO_CREDENTIALS.farmer;
      const userData = {
        name: config.name,
        email: config.email,
        role: config.role,
        roleKey: 'farmer',
        location: config.location,
        avatar: config.avatar,
      };
      setUser(userData);
      return { success: true, user: userData };
    }

    const fallbackRole = targetConfig || DEMO_CREDENTIALS.farmer;
    return {
      success: false,
      message: `Invalid credentials. For ${fallbackRole.role} you can use:\nEmail: ${fallbackRole.email} (or simply "farmer")\nPassword: ${fallbackRole.password} (or "farmer@123")`,
    };
  };

  const logout = () => {
    setUser(null);
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
      value={{ user, login, logout, updateUserProfile, isAuthenticated: !!user }}
    >
      {children}
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
