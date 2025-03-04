import { APIResponse, Status, AuthRequest } from "../utils/structure";
import { Request, Response } from "express";
import { User } from "../models/user";
import dotenv from "dotenv";
import { uploadToS3 } from "../utils/s3";
import { isValidObjectId } from "mongoose";

dotenv.config();

export const getUserInfo = async (req: Request, res: Response) => {
    try {

        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).send(new APIResponse(Status.ERROR, [], "Utente non trovato"));
            return
        }

        const userResponse = {  name: user.name, surname: user.surname, username: user.username, email: user.email, image : user.profileImage };

        res.status(200).send(new APIResponse(Status.SUCCESS, userResponse, "Informazioni utente recuperate con successo"));

    } catch (err) {
        console.log(err)
        res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel recupero delle informazioni utente"));
    }

}

export const getUserProfileImage = async (req: Request, res: Response) => {
    try {
      // 📌 L'ID utente viene estratto dal token JWT
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
  
      if (!userId) {
        return res.status(403).send(new APIResponse(Status.ERROR, [], "Non autorizzato"));
      }
  
      // 📌 Cerchiamo l'utente nel database
      const user = await User.findById(userId).select("profileImage");
  
      if (!user) {
        return res.status(404).send(new APIResponse(Status.ERROR, [], "Utente non trovato"));
      }
  
      if (!user.profileImage) {
        return res.status(404).send(new APIResponse(Status.ERROR, [], "L'utente non ha un'immagine profilo"));
      }
  
      // 📌 Restituiamo l'URL dell'immagine profilo
      res.status(200).send(new APIResponse(Status.SUCCESS, { profileImage: user.profileImage }, "Immagine profilo recuperata con successo"));
  
    } catch (error) {
      console.error("Errore nel recupero dell'immagine profilo:", error);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel recupero dell'immagine profilo"));
    }
  };


  export const uploadProfileImage = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest; // 🔹 Prende l'utente autenticato
      const userId = authReq.user?.id;
  
      if (!isValidObjectId(userId)) {
        res.status(401).send(new APIResponse(Status.ERROR, [], "Formato userId non valido"));
        return
      }
  
      if (!req.file) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Nessun file caricato"));
        return
      }
  
      // 📌 1️⃣ Carica il file su S3
      const imageUrl = await uploadToS3(req.file, userId as string);
  
      // 📌 2️⃣ Aggiorna il profilo dell'utente con il nuovo URL dell'immagine
      await User.findByIdAndUpdate(userId, { profileImage: imageUrl });
  
      res.status(200).send(new APIResponse(Status.SUCCESS, { imageUrl }, "Immagine profilo caricata con successo"));
    } catch (err) {
      console.error("Errore nel caricamento dell'immagin profilo: ", err);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel caricamento dell'immagine profilo"));
    }
  };