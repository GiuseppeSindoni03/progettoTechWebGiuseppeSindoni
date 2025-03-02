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
exports.uploadProfilePicture = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
const structure_1 = require("../utils/structure");
dotenv_1.default.config();
// 🔹 Configuriamo AWS S3
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION, // Es: "us-east-1"
});
// 🔹 Configuriamo `multer` per caricare direttamente su S3
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: "hive-mind-4107",
        acl: "public-read",
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `images/${uniqueSuffix}-${file.originalname}`); // 🔹 Salva in `/images/`
        },
    }),
});
// 🔹 Middleware per l'upload
exports.uploadMiddleware = upload.single("profileImage");
// 🔹 API per caricare l'immagine e salvare l'URL nel database
const uploadProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!req.file) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Nessun file caricato"));
            return;
        }
        // 📌 URL pubblico dell'immagine su S3
        const profileImageUrl = req.file.location;
        // 📌 Aggiorniamo il profilo utente con l'URL dell'immagine
        const updatedUser = yield user_1.User.findByIdAndUpdate(userId, { profileImage: profileImageUrl }, { new: true });
        if (!updatedUser) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Utente non trovato"));
            return;
        }
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, [], "Immagine del profilo aggiornata con successo"));
    }
    catch (error) {
        console.error("Errore nell'upload su S3:", error);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nell'upload dell'immagine"));
    }
});
exports.uploadProfilePicture = uploadProfilePicture;
