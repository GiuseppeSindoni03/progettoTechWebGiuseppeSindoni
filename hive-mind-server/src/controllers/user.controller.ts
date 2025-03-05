import { APIResponse, Status, AuthRequest } from "../utils/structure";
import { Request, Response } from "express";
import { User } from "../models/user";
import dotenv from "dotenv";
import { uploadToS3 } from "../utils/s3";
import { isValidObjectId } from "mongoose";
import { getSignedUrl } from "../utils/s3";

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
        res.status(403).send(new APIResponse(Status.ERROR, [], "Non autorizzato"));
        return
      }
  
      // 📌 Cerchiamo l'utente nel database
      const user = await User.findById(userId).select("profileImage");
  
      if (!user) {
         res.status(404).send(new APIResponse(Status.ERROR, [], "Utente non trovato"));
         return
      }
      
      console.log("📌 Utente recuperato:", user);

      let fileKey = user.profileImage;

      if (!fileKey) {
        fileKey = "default/default_image.jpg";
      }

      console.log("📌 Chiave immagine salvata nel DB:", fileKey);
      
      const signedUrl = await getSignedUrl(fileKey);

      console.log("✅ Signed URL generato:", signedUrl);

      res.status(200).send(new APIResponse(Status.SUCCESS, { profileImage: signedUrl }, "Immagine profilo recuperata con successo"));
  
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

      const fileKey = `images/${userId}/${userId}_${Date.now()}_${req.file.originalname}`;

      await uploadToS3(req.file, fileKey);

      
      await User.findByIdAndUpdate(userId, { profileImage: fileKey });
  
      res.status(200).send(new APIResponse(Status.SUCCESS, { fileKey }, "Immagine profilo caricata con successo"));
    } catch (err) {
      console.error("Errore nel caricamento dell'immagin profilo: ", err);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel caricamento dell'immagine profilo"));
    }
  };


  

