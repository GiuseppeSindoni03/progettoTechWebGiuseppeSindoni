"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVote = void 0;
const structure_1 = require("../utils/structure");
const mongoose_1 = require("mongoose");
const idea_1 = require("../models/idea");
const vote_1 = require("../models/vote");
const validators_1 = require("../utils/validators");
const setVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        const ideaId = req.params.id;
        const vote = req.body.vote;
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid UserId format"));
            return;
        }
        if (!(0, mongoose_1.isValidObjectId)(ideaId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid IdeaId format"));
            return;
        }
        if (!(0, validators_1.isVoteValid)(vote)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Vote must be 1 or -1"));
            return;
        }
        const foundIdea = yield idea_1.Idea.findById(ideaId);
        if (!foundIdea) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Idea not found"));
            return;
        }
        if ((0, validators_1.isUserAuthor)(foundIdea.author.toString(), userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "You can't vote your own idea"));
            return;
        }
        updateIdeaVotes(foundIdea, userId, vote);
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, [], "Vote updated successfully"));
    }
    catch (err) {
        console.error("Error updating vote:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Error updating vote"));
    }
});
exports.setVote = setVote;
const updateIdeaVotes = (foundIdea, userId, vote) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔹 4️⃣ Trova il voto dell'utente
    const existingVote = yield vote_1.Vote.findOne({ user: userId, idea: foundIdea._id });
    // 🔹 5️⃣ Se l'utente non ha mai votato, crea un nuovo voto
    if (!existingVote) {
        const newVote = new vote_1.Vote({ user: userId, idea: foundIdea._id, valore: vote });
        yield newVote.save();
        // Aggiorna il conteggio degli upvotes/downvotes
        if (vote === 1) {
            foundIdea.upvotes++;
        }
        else {
            foundIdea.downvotes++;
        }
    }
    // 🔹 6️⃣ Se l'utente ha già votato
    else {
        if (existingVote.valore === vote) {
            // Se l'utente clicca di nuovo sullo stesso voto, rimuoviamo il voto
            yield vote_1.Vote.deleteOne({ _id: existingVote._id });
            // Aggiorna i conteggi
            if (vote === 1) {
                foundIdea.upvotes--;
            }
            else {
                foundIdea.downvotes--;
            }
        }
        else {
            // Se l'utente cambia voto (da 1 a -1 o viceversa)
            existingVote.valore = vote;
            yield existingVote.save();
            // Aggiorna il conteggio degli upvotes/downvotes
            if (vote === 1) {
                foundIdea.upvotes++;
                foundIdea.downvotes--;
            }
            else {
                foundIdea.downvotes++;
                foundIdea.upvotes--;
            }
        }
    }
    // 🔹 7️⃣ Salva i cambiamenti all'idea
    yield foundIdea.save();
});
