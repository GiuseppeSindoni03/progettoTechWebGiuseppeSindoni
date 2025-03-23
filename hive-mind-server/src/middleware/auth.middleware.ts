import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { APIResponse, Status } from "../utils/structure";

dotenv.config();


interface JwtPayload {
  id: string; 
  email: string;
  username: string;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).send(new APIResponse(Status.ERROR, [], "Token non fornito"));
      return;
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    (req as AuthRequest).user = decoded as JwtPayload;

    next();
  } catch (err) {
    res.status(403).send(new APIResponse(Status.ERROR, [], "Token non valido"));
  }
};
