import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ Carica le variabili d'ambiente

const MONGO_URI = process.env.MONGO_URI as string; // Assicurati che sia definito nel tuo `.env`

const resetDatabase = async () => {
  try {
    // 🔹 1️⃣ Connetti al database
    const connection = await mongoose.connect(MONGO_URI);
    console.log("✅ Connesso al database");

    // 🔹 2️⃣ Controlla che `db` sia definito
    if (!mongoose.connection.db) {
      throw new Error("La connessione al database non è ancora pronta.");
    }

    // 🔹 3️⃣ Recupera tutte le collezioni
    const collections = await mongoose.connection.db.listCollections().toArray();

    if (collections.length === 0) {
      console.log("⚠️ Nessuna collezione trovata nel database.");
      await mongoose.disconnect();
      return;
    }

    // 🔹 4️⃣ Cancella tutte le collezioni
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`🗑️ Collezione eliminata: ${collection.name}`);
    }

    console.log("✅ Tutte le collezioni sono state eliminate con successo.");
  } catch (err) {
    console.error("❌ Errore durante la cancellazione del database:", err);
    process.exit(1);
  } finally {
    // 🔹 5️⃣ Disconnetti dal database
    await mongoose.disconnect();
    console.log("🔌 Disconnesso dal database.");
  }
};

// 🔹 Esegui lo script
resetDatabase();
