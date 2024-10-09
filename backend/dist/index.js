"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// Prisma Clientを使用したデータベース操作の例
app.get('/solar-systems', async (req, res) => {
    const solarSystems = await prisma.solar_system.findMany();
    res.json(solarSystems);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
