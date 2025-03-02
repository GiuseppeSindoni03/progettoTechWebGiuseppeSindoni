import { APIResponse, Status, AuthRequest } from "../utils/structure";
import { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { Idea } from "../models/idea";
import { Vote } from "../models/vote";
import { isVoteValid, isUserAuthor } from "../utils/validators";




export const setVote = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest; 
        const userId = authReq.user?.id; 
        const ideaId = req.params.id;
        const vote: number = req.body.vote;
        
        if (!isValidObjectId(userId)) {
            res.status(400).send(new APIResponse(Status.ERROR, [], "Invalid UserId format")); return;
        }

        if(!isValidObjectId(ideaId)){
            res.status(400).send(new APIResponse(Status.ERROR, [], "Invalid IdeaId format")); return;
        }

        if (!isVoteValid(vote)) {
            res.status(400).send(new APIResponse(Status.ERROR, [], "Vote must be 1 or -1")); return;
        }

        const foundIdea = await Idea.findById(ideaId);

        if(!foundIdea){
            res.status(404).send(new APIResponse(Status.ERROR, [], "Idea not found")); return;
        }

        if (isUserAuthor(foundIdea.author.toString(), userId)) {
            res.status(400).send(new APIResponse(Status.ERROR, [], "You can't vote your own idea")); return;
        }

        updateIdeaVotes(foundIdea, userId as string, vote);


        res.status(200).send(new APIResponse(Status.SUCCESS, [], "Vote updated successfully"));

    } catch (err) {
        console.error("Error updating vote:", err);
        res.status(500).send(new APIResponse(Status.ERROR, [], "Error updating vote"));
    }
};

const updateIdeaVotes = async (foundIdea: any, userId: string ,vote: number) => {

        // 🔹 4️⃣ Trova il voto dell'utente
        const existingVote = await Vote.findOne({ user: userId, idea: foundIdea._id });

        // 🔹 5️⃣ Se l'utente non ha mai votato, crea un nuovo voto
        if (!existingVote) {
            const newVote = new Vote({ user: userId, idea: foundIdea._id, valore: vote });
            await newVote.save();

            // Aggiorna il conteggio degli upvotes/downvotes
            if (vote === 1) {
                foundIdea.upvotes++;
            } else {
                foundIdea.downvotes++;
            }
        }
        // 🔹 6️⃣ Se l'utente ha già votato
        else {
            if (existingVote.valore === vote) {
                // Se l'utente clicca di nuovo sullo stesso voto, rimuoviamo il voto
                await Vote.deleteOne({ _id: existingVote._id });

                // Aggiorna i conteggi
                if (vote === 1) {
                    foundIdea.upvotes--;
                } else {
                    foundIdea.downvotes--;
                }
            } else {
                // Se l'utente cambia voto (da 1 a -1 o viceversa)
                existingVote.valore = vote;
                await existingVote.save();

                // Aggiorna il conteggio degli upvotes/downvotes
                if (vote === 1) {
                    foundIdea.upvotes++;
                    foundIdea.downvotes--;
                } else {
                    foundIdea.downvotes++;
                    foundIdea.upvotes--;
                }
            }
        }

        // 🔹 7️⃣ Salva i cambiamenti all'idea
        await foundIdea.save();
}
