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
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
console.log("AWS_BUCKET_NAME:", BUCKET_NAME);
console.log("AWS_REGION:", REGION);
console.log("AWS_ACCESS_KEY_ID:", ACCESS_KEY_ID ? "✅ Key Loaded" : "❌ Key MISSING");
console.log("AWS_SECRET_ACCESS_KEY:", SECRET_ACCESS_KEY ? "✅ Key Loaded" : "❌ Key MISSING");
// 🔹 Configura il client S3 con AWS SDK v3
const s3 = new client_s3_1.S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});
// 📌 Funzione per caricare un file su S3
const uploadToS3 = (file, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `images/${userId}/${userId}_${Date.now()}_${file.originalname}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    // 🔹 Usa AWS SDK v3 per caricare il file
    const command = new client_s3_1.PutObjectCommand(params);
    yield s3.send(command);
    // 🔹 Restituisce l'URL del file su S3
    console.log(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`);
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
});
exports.uploadToS3 = uploadToS3;
