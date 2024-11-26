"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
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
