import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();

// Connessione al database
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
