"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const corsConfig_1 = require("./config/corsConfig");
const solarSystems_1 = __importDefault(require("./routes/solarSystems"));
const batteries_1 = __importDefault(require("./routes/batteries"));
const constructionCosts_1 = __importDefault(require("./routes/constructionCosts"));
const routes_1 = __importDefault(require("./auth/routes"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)(corsConfig_1.corsOptions));
app.use(express_1.default.json());
// ルートパスのテスト用エンドポイント
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});
// ルーターの設定
app.use('/api/solar-systems', solarSystems_1.default);
app.use('/api/batteries', batteries_1.default);
app.use('/api/construction-costs', constructionCosts_1.default);
app.use('/api/auth', routes_1.default);
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
