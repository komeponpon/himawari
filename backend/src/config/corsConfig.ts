import cors from 'cors';

export const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://192.168.0.191:3000',
    'http://frontend:3000',
    'http://localhost:5001',
    'http://192.168.0.191:5001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};