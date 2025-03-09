import { Request, Response } from "express";
import { Idea } from "../models/idea"; // Assicurati che il modello sia importato correttamente
import { APIResponse, SearchType, Status } from "../utils/structure";
import { Vote } from "../models/vote";
import { isValidObjectId } from "mongoose";
import { validateFields } from "../utils/validators";
import {  getIdeasPipeline } from "../utils/db.helpers";
import { marked } from "marked";

interface AuthRequest extends Request {
  user?: {
    id: string; 
    email: string;
    username: string;
  };
}

export const getIdeas = async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find()
      .populate("author", "username profileImage") // 🔹 Popola autore con username e immagine profilo
      .populate({
        path: "comments.author", // 🔹 Popola i dati degli autori dei commenti
        select: "username profileImage"
      })
      .select("-__v"); // 🔹 Escludi __v (versione di Mongoose)

    if (ideas.length > 0) {
      res.status(200).send(new APIResponse(Status.SUCCESS, ideas, "Idee recuperate con successo"));
    } else {
      res.status(404).send(new APIResponse(Status.ERROR, [], "Nessuna idea trovata"));
    }
  } catch (err) {
    console.error("Errore nel recupero delle idee:", err);
    res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel recupero delle idee"));
  }
};

export const getIdeasByUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest; 
    const userId = authReq.user?.id; 


    if (!userId || !isValidObjectId(userId)) {
      res.status(400).send(new APIResponse(Status.ERROR, [], "Formato userId invalido"));
      return
    }

    // 🔹 Estrai paginazione dai query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    page < 1 ? 1 : page;
    limit > 10 ? 10 : limit;


    // 🔹 Query con paginazione
    const ideas = await Idea.find({ author: userId })
      .populate("author", "username")
      .populate("comments.author", "username")
      .select("-__v")
      .skip((page - 1) * limit)
      .limit(limit);


    if (ideas.length > 0) {
      res.status(200).send(new APIResponse(Status.SUCCESS, ideas, "Idee recuperate con successo"));
    } else {
      console.log("⚠️ Nessuna idea trovata");
      res.status(404).send(new APIResponse(Status.ERROR, [], "Nessuna idea trovata"));
    }
  } catch (err) {
    console.error("❌ Errore nel recupero delle idee:", err);
    res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel recupero delle idee dell'utente"));
  }
};

  

export const postIdea = async (req: Request, res: Response) : Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    const {title, content } = req.body;

    if (!validateFields( res, {title, content}))
      return;
  

    if (!isValidObjectId(userId)) {
      res.status(400).send(new APIResponse(Status.ERROR, [], "Formato userId invalido")); return;
    }

    const contentHtml = marked(content);

    const newIdea = new Idea({ 
       title, 
       content, 
       contentHtml,
       author: userId });

    await newIdea.save();

   const newIdeaResponse = {  
      _id: newIdea._id,
      title,
      content,
      contentHtml: newIdea.contentHtml, // 🔹 Includi l'HTML generato
      authorId: userId, 
      authorUsername: authReq.user?.username, 
      timestamp: newIdea.timestamp 
    };

    res.status(201).send(new APIResponse(Status.SUCCESS, newIdeaResponse, "Nuova idea creata con successo"));
  } catch (err) {
      console.error("Errore nella creazione dell'idea:", err);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nella creazione di una nuova idea"));
  }
};


export const getIdeaById = async (req: Request, res: Response) => {
  try {
    const ideaId = req.params.id;


    if (!isValidObjectId(ideaId)) {
      res.status(400).send(new APIResponse(Status.ERROR, [], "Formato ideaId non valido"));
      return
    }

   
    const idea = await Idea.findById(ideaId)
      .populate("author", "username") 
      .populate({
        path: "comments.author",
        select: "username" 
      })
      .select("-__v"); 

    

    if (!idea) {
      res.status(404).send(new APIResponse(Status.ERROR, [], "Idea non trovata"));
      return
    }

    res.status(200).send(new APIResponse(Status.SUCCESS, idea, "Idea recuperata con successo"));
  
  } catch (err) {
    console.error("❌ Errore nel recupero dell'idea:", err);
    res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel recupero dell'idea"));
  }
};
export const deleteIdea = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const ideaId = req.params.id;

    //  Verifica validità degli ID
    if (!isValidObjectId(userId)) {
      res.status(400).send(new APIResponse(Status.ERROR, [], "Formato userId invalido")); return
    }
    if (!isValidObjectId(ideaId)) {
      res.status(400).send(new APIResponse(Status.ERROR, [], "Formato ideaId invalido")); return
    }

    //  Trova l'idea
    const ideaFound = await Idea.findById({ _id: ideaId });

    if (!ideaFound) {
      res.status(404).send(new APIResponse(Status.ERROR, [], "Idea non trovata")); return
    }

    //  Controlla che l'utente sia l'autore dell'idea
    const author = ideaFound.author.toString()

    if (!checkUserIsAuthor(author, userId)) {
      res.status(403).send(new APIResponse(Status.ERROR, [], "Non hai il permesso di cancellare questa idea.")); return
    }

    
    await Promise.all([
      Idea.findByIdAndDelete(ideaId), // Cancella l'idea
      Vote.deleteMany({ idea: ideaId }) // Cancella tutti i voti associati
    ]);

    res.status(200).send(new APIResponse(Status.SUCCESS, [], "Idea cancellata con successo"));

  } catch (err) {
    console.error("Errore nella cancellazione dell'idea:", err);
    res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nella cancellazione dell'idea"));
  }

  function checkUserIsAuthor(author: string, userId: string | undefined) {
    return author === userId;
  }
};



export const getIdeasHome = async (req: Request, res: Response) => {
  try {
      const { type } = req.params as { type: SearchType }; 
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      page < 1 ? 1 : page;
      limit > 10 ? 10 : limit;



      console.log("Back end Recupero idee per tipo:", type);
      const pipeline = getIdeasPipeline(type, page, limit);

      
      const ideas = await Idea.aggregate(pipeline);

      
      
      if (!ideas.length) {
          res.status(404).send(new APIResponse(Status.ERROR, [], `Nessun idea ${type} trovata`));
          return
      }


      res.status(200).send(new APIResponse(Status.SUCCESS, ideas, `Idee ${type} ottenute con successo`));

  } catch (err) {
      console.error("Errore nel recupero delle idee:", err);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel recupero delle idee"));
  }
};