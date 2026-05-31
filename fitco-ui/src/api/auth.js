import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

export const register = (data) => api.post('/api/v1/auth/register', data);
export const login = (data) => api.post('/api/v1/auth/login', data);
