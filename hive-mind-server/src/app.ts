import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import ideaRoutes from "./routes/idea.routes";
import authRoutes from "./routes/auth.routes";
import voteRoutes from "./routes/vote.routes";
import comment from "./routes/comment.routes";
import userRoutes from "./routes/user.routes";
import path from "path";

dotenv.config();

const app: Application = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());


// ✅ Definizione delle rotte
app.use("/ideas", ideaRoutes);
app.use("/auth", authRoutes);
app.use("/ideas", voteRoutes);
app.use("/ideas", comment);
app.use("/me", userRoutes);
app.get("/", (req, res) => {
  res.send("Hivemind API is running!");
});

export default app;
