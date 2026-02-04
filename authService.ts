
import { User } from './types.ts';

const USERS_KEY = 'unievent_users';
const SESSION_KEY = 'unievent_session';

export const authService = {
  getUsers: (): any[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  signup: (name: string, email: string, password: string): { success: boolean; message: string } => {
    const users = authService.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists.' };
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    authService.login(email, password); // Auto login after signup
    return { success: true, message: 'Account created successfully!' };
  },

  login: (email: string, password: string): { success: boolean; user?: User; message: string } => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const sessionUser: User = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser, message: 'Welcome back!' };
    }
    return { success: false, message: 'Invalid email or password.' };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
};
