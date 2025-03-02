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
exports.uploadProfileImage = exports.getUserProfileImage = exports.getUserInfo = void 0;
const structure_1 = require("../utils/structure");
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
const s3_1 = require("../utils/s3");
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield user_1.User.findById(userId);
        if (!user) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Utente non trovato"));
            return;
        }
        const userResponse = { name: user.name, surname: user.surname, username: user.username, email: user.email, image: user.profileImage };
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, userResponse, "Informazioni utente recuperate con successo"));
    }
    catch (err) {
        console.log(err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero delle informazioni utente"));
    }
});
exports.getUserInfo = getUserInfo;
const getUserProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // 📌 L'ID utente viene estratto dal token JWT
        const authReq = req;
        const userId = (_b = authReq.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            return res.status(403).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Non autorizzato"));
        }
        // 📌 Cerchiamo l'utente nel database
        const user = yield user_1.User.findById(userId).select("profileImage");
        if (!user) {
            return res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Utente non trovato"));
        }
        if (!user.profileImage) {
            return res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "L'utente non ha un'immagine profilo"));
        }
        // 📌 Restituiamo l'URL dell'immagine profilo
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, { profileImage: user.profileImage }, "Immagine profilo recuperata con successo"));
    }
    catch (error) {
        console.error("Errore nel recupero dell'immagine profilo:", error);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero dell'immagine profilo"));
    }
});
exports.getUserProfileImage = getUserProfileImage;
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const authReq = req; // 🔹 Prende l'utente autenticato
        const userId = (_c = authReq.user) === null || _c === void 0 ? void 0 : _c.id;
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(401).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Unauthorized"));
            return;
        }
        if (!req.file) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "No file uploaded"));
            return;
        }
        // 📌 1️⃣ Carica il file su S3
        const imageUrl = yield (0, s3_1.uploadToS3)(req.file, userId);
        // 📌 2️⃣ Aggiorna il profilo dell'utente con il nuovo URL dell'immagine
        yield user_1.User.findByIdAndUpdate(userId, { profileImage: imageUrl });
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, { imageUrl }, "Profile image uploaded successfully"));
    }
    catch (err) {
        console.error("Error uploading profile image:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Error uploading profile image"));
    }
});
exports.uploadProfileImage = uploadProfileImage;
