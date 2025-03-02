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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Carica le variabili d'ambiente
const MONGO_URI = process.env.MONGO_URI; // Assicurati che sia definito nel tuo `.env`
const resetDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 🔹 1️⃣ Connetti al database
        const connection = yield mongoose_1.default.connect(MONGO_URI);
        console.log("✅ Connesso al database");
        // 🔹 2️⃣ Controlla che `db` sia definito
        if (!mongoose_1.default.connection.db) {
            throw new Error("La connessione al database non è ancora pronta.");
        }
        // 🔹 3️⃣ Recupera tutte le collezioni
        const collections = yield mongoose_1.default.connection.db.listCollections().toArray();
        if (collections.length === 0) {
            console.log("⚠️ Nessuna collezione trovata nel database.");
            yield mongoose_1.default.disconnect();
            return;
        }
        // 🔹 4️⃣ Cancella tutte le collezioni
        for (const collection of collections) {
            yield mongoose_1.default.connection.db.dropCollection(collection.name);
            console.log(`🗑️ Collezione eliminata: ${collection.name}`);
        }
        console.log("✅ Tutte le collezioni sono state eliminate con successo.");
    }
    catch (err) {
        console.error("❌ Errore durante la cancellazione del database:", err);
        process.exit(1);
    }
    finally {
        // 🔹 5️⃣ Disconnetti dal database
        yield mongoose_1.default.disconnect();
        console.log("🔌 Disconnesso dal database.");
    }
});
// 🔹 Esegui lo script
resetDatabase();
