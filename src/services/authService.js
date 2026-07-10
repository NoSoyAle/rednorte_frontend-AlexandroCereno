import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role, nombre } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('nombre', nombre || email);
      localStorage.setItem('user', JSON.stringify({ nombre: nombre || email, role }));

      return { token, role, nombre: nombre || email };
    } catch (error) {
      console.error('=== LOGIN FALLÓ ===');
      console.error('response.data completo:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('===================');
      throw error;
    }
  },

  register: async (rut, nombre, password) => {
    const response = await api.post('/auth/registro', { rut, nombre, password });
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};
