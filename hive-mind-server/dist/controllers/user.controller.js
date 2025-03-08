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
exports.uploadProfileImage = exports.getUserProfileImageWithId = exports.getUserProfileImage = exports.getUserInfo = void 0;
const structure_1 = require("../utils/structure");
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
const s3_1 = require("../utils/s3");
const mongoose_1 = require("mongoose");
const s3_2 = require("../utils/s3");
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
        const userResponse = { _id: userId, name: user.name, surname: user.surname, username: user.username, email: user.email, image: user.profileImage };
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
        if (!userId || !(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(403).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Non autorizzato"));
            return;
        }
        const user = yield user_1.User.findById(userId).select("profileImage");
        if (!user) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Utente non trovato"));
            return;
        }
        let fileKey = user.profileImage;
        if (!fileKey) {
            fileKey = "default/default_image.jpg";
        }
        const signedUrl = yield (0, s3_2.getSignedUrl)(fileKey);
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, { profileImage: signedUrl }, "Immagine profilo recuperata con successo"));
    }
    catch (error) {
        console.error("Errore nel recupero dell'immagine profilo:", error);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero dell'immagine profilo"));
    }
});
exports.getUserProfileImage = getUserProfileImage;
const getUserProfileImageWithId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 📌 L'ID utente viene estratto dal token JWT
        const userId = req.params.id;
        if (!userId || !(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "ID utente non valido"));
            return;
        }
        const user = yield user_1.User.findById(userId).select("profileImage");
        if (!user) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Utente non trovato"));
            return;
        }
        let fileKey = user.profileImage;
        if (!fileKey) {
            fileKey = "default/default_image.jpg";
        }
        const signedUrl = yield (0, s3_2.getSignedUrl)(fileKey);
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, { profileImage: signedUrl }, "Immagine profilo recuperata con successo"));
    }
    catch (error) {
        console.error("Errore nel recupero dell'immagine profilo:", error);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero dell'immagine profilo"));
    }
});
exports.getUserProfileImageWithId = getUserProfileImageWithId;
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const authReq = req; // 🔹 Prende l'utente autenticato
        const userId = (_c = authReq.user) === null || _c === void 0 ? void 0 : _c.id;
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(401).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Formato userId non valido"));
            return;
        }
        if (!req.file) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Nessun file caricato"));
            return;
        }
        const fileKey = `images/${userId}/${userId}_${Date.now()}_${req.file.originalname}`;
        yield (0, s3_1.uploadToS3)(req.file, fileKey);
        yield user_1.User.findByIdAndUpdate(userId, { profileImage: fileKey });
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, { fileKey }, "Immagine profilo caricata con successo"));
    }
    catch (err) {
        console.error("Errore nel caricamento dell'immagin profilo: ", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel caricamento dell'immagine profilo"));
    }
});
exports.uploadProfileImage = uploadProfileImage;
