"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db/db"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
const port = process.env.PORT || 4002;
// DB connection
(0, db_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.HOST_URL || "*"
}));
app.use('/api', index_1.default);
app.get('/test', (req, res) => {
    res.send('hiii');
});
app.listen(port, () => {
    console.log(`server started at: ${port}`);
});
//# sourceMappingURL=index.js.map