"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
dotenv_1.default.config();
// Connessione al database
(0, db_1.connectDB)();
const PORT = process.env.PORT || 4000;
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
