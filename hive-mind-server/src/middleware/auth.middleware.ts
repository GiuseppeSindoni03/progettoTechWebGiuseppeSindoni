import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { APIResponse, Status } from "../utils/structure";

dotenv.config();

// ✅ Correggi `JwtPayload` per avere `id` come `string`
interface JwtPayload {
  id: string; // 🔹 Ora è una stringa compatibile con MongoDB
  email: string;
  username: string;
}

// ✅ Estendiamo `Request` per aggiungere `user`
interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).send(new APIResponse(Status.ERROR, [], "Token non fornito"));
      return;
    }

    // ✅ Verifica il JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // ✅ Salva l'utente nella request
    (req as AuthRequest).user = decoded as { id: string; username: string; email: string };

    next();
  } catch (err) {
    res.status(403).send(new APIResponse(Status.ERROR, [], "Token non valido"));
  }
};
