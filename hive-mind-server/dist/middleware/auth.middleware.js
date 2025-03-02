"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const structure_1 = require("../utils/structure");
dotenv_1.default.config();
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(401).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Token non fornito"));
            return;
        }
        // ✅ Verifica il JWT
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ Salva l'utente nella request
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Token non valido"));
    }
});
exports.authenticateToken = authenticateToken;
