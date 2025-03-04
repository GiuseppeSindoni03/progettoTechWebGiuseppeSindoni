import { Request, Response } from "express";
import { APIResponse, Status } from "../utils/structure";
import { AuthRequest } from "../utils/structure";
import dotenv from "dotenv";
import mongoose, { isValidObjectId } from "mongoose";
import { Idea } from "../models/idea";


dotenv.config();


export const postComment = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest; 
        const userId = authReq.user?.id; 

        const { ideaId } = req.params;
        const { content } = req.body; 

        
        if (!isValidObjectId(userId)) {
          res.status(400).send(new APIResponse(Status.ERROR, [], "Formato userId invalido")); return 
      }

        
        if (!isValidObjectId(ideaId)) {
          res.status(400).send(new APIResponse(Status.ERROR, [], "Formato ideaId invalido")); return 
        }

        
        const foundIdea = await Idea.findById(ideaId);
        if (!foundIdea) {
            res.status(404).send(new APIResponse(Status.ERROR, [], "Idea non trovata")); return 
        }
        

        
        if (isCommentEmpty(content)) {
            res.status(400).send(new APIResponse(Status.ERROR, [], "Commento non puo' esser vuoto"));
              return 
        }

        const newComment = {
            author: userId,
            content: content,
            timestamp: new Date()
        };

        
        foundIdea.comments.push(newComment);
        await foundIdea.save();

        res.status(201).send(new APIResponse(Status.SUCCESS, newComment, "Commento salvato con successo"));

    } catch (err) {
        console.error("Errore nel salvataggio del commento:", err);
        res.status(500).send(new APIResponse(Status.ERROR, [], "Errore interno del server"));
    }

    function isCommentEmpty(commentText: any) {
        return !commentText || (typeof commentText === "string" && commentText.trim() === "");
    }
};



export const deleteIdeaComment = async (req: Request, res: Response) => {
  try {
      const { ideaId: ideaId, commentId: commentId } = req.params;

      const authReq = req as unknown as AuthRequest; 
      const userId = authReq.user?.id; 

      
      if (!isValidObjectId(userId)) {
          res.status(400).send(new APIResponse(Status.ERROR, [], "Formato userId invalido")); return;
      }
      if (!isValidObjectId(ideaId)) {
          res.status(400).send(new APIResponse(Status.ERROR, [], "Formato ideaId invalido")); return 
      }
      if (!isValidObjectId(commentId)) {
          res.status(400).send(new APIResponse(Status.ERROR, [], "Formato commentId invalido")); return 
      }

      const idea = await Idea.findById(ideaId);
    
      if (!idea) {
        res.status(404).send(new APIResponse(Status.ERROR, [], "Idea non trovata")); return
      }
      
      const comment = idea.comments.find(c => c._id && c._id.toString() === commentId);

      if (!comment) {
          res.status(404).send(new APIResponse(Status.ERROR, [], "Commento non trovato")); return 
      }

      if (!isUserAuthorizedToDeleteComment(comment.author.toString(), userId as string, idea.author.toString())) {
        res.status(403).send(new APIResponse(Status.ERROR, [], "Non hai il permesso di cancellare questo commento"));
        return;
      }

      idea.comments.pull({ _id: commentId });
      await idea.save();
      
      res.status(200).send(new APIResponse(Status.SUCCESS, [], "Commento cancellato con successo"));

  } catch (err) {
      console.error("Errore nella cancellazione del commento:", err);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nella cancellazione del commento"));
  }

    function isUserAuthorizedToDeleteComment(commentAuthor: string, userId: string, ideaAuthor: string) {
        return commentAuthor.toString() === userId || ideaAuthor === userId;
    }
};  
