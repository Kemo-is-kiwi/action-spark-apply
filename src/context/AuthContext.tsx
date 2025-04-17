
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { users } from '../services/mockData';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  depositCash: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  depositCash: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulating authentication
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const user = users.find(u => u.email === email);
        
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          toast.success("Login successful!");
        } else {
          toast.error("Invalid email or password");
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Login failed. Please try again.");
    }
  };

  const register = async (username: string, email: string, password: string) => {
    // Simulating registration
    setIsLoading(true);
    
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        toast.error("Email already in use");
        setIsLoading(false);
        return;
      }
      
      // In a real app, this would be an API call to create a user
      setTimeout(() => {
        const newUser: User = {
          id: (users.length + 1).toString(),
          username,
          email,
          cashBalance: 500, // Starting balance
          createdAt: new Date().toISOString(),
        };
        
        users.push(newUser);
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        toast.success("Account created successfully!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.success("Logged out successfully");
  };

  const depositCash = (amount: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        cashBalance: currentUser.cashBalance + amount
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      toast.success(`$${amount} deposited successfully!`);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isLoading, 
        isAuthenticated: !!currentUser,
        login, 
        register, 
        logout,
        depositCash
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
