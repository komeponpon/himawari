import cors from 'cors';

export const corsOptions = {
  origin: [
    'http://34.97.52.199:3000',
    'http://34.97.52.199:5001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};