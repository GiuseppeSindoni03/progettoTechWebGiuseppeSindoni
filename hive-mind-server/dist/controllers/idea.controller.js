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
exports.getIdeasHome = exports.deleteIdea = exports.getIdeaById = exports.postIdea = exports.getIdeasByUser = exports.getIdeas = void 0;
const idea_1 = require("../models/idea"); // Assicurati che il modello sia importato correttamente
const structure_1 = require("../utils/structure");
const vote_1 = require("../models/vote");
const mongoose_1 = require("mongoose");
const validators_1 = require("../utils/validators");
const db_helpers_1 = require("../utils/db.helpers");
const getIdeas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ideas = yield idea_1.Idea.find()
            .populate("author", "username profileImage") // 🔹 Popola autore con username e immagine profilo
            .populate({
            path: "comments.author",
            select: "username profileImage"
        })
            .select("-__v"); // 🔹 Escludi __v (versione di Mongoose)
        if (ideas.length > 0) {
            res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, ideas, "Ideas retrieved successfully"));
        }
        else {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "No ideas found"));
        }
    }
    catch (err) {
        console.error("Errore nel recupero delle idee:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero delle idee"));
    }
});
exports.getIdeas = getIdeas;
const getIdeasByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid UserId format"));
            return;
        }
        const ideas = yield idea_1.Idea.find({ author: userId })
            .populate("author", "username ")
            .populate("comments.author", "username")
            .select("-__v");
        if (ideas.length > 0) {
            res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, ideas, "Ideas retrieved successfully"));
        }
        else {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "No ideas found for this user"));
        }
    }
    catch (err) {
        console.error("Errore nel recupero delle idee:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero delle idee dell'utente"));
    }
});
exports.getIdeasByUser = getIdeasByUser;
const postIdea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const authReq = req;
        const userId = (_b = authReq.user) === null || _b === void 0 ? void 0 : _b.id;
        const { title, content } = req.body;
        if (!(0, validators_1.validateFields)(res, { title, content, userId }))
            return;
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid UserId format"));
            return;
        }
        const newIdea = new idea_1.Idea({
            title,
            content,
            author: userId
        });
        yield newIdea.save();
        const newIdeaResponse = {
            _id: newIdea._id,
            title,
            content,
            contentHtml: newIdea.contentHtml,
            authorId: userId,
            authorUsername: (_c = authReq.user) === null || _c === void 0 ? void 0 : _c.username,
            timestamp: newIdea.timestamp
        };
        res.status(201).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, newIdeaResponse, "New idea created successfully"));
    }
    catch (err) {
        console.error("Errore nella creazione dell'idea:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nella creazione di una nuova idea"));
    }
});
exports.postIdea = postIdea;
const getIdeaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ideaId = req.params.id;
        if (!(0, mongoose_1.isValidObjectId)(ideaId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid IdeaId format"));
            return;
        }
        const idea = yield idea_1.Idea.findOne({ _id: ideaId })
            .populate("author", "username")
            .populate("comments.user", "username");
        if (!idea) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Idea not found"));
            return;
        }
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, idea, "Idea retrieved successfully"));
    }
    catch (err) {
        console.error("Errore nel recupero dell'idea:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero dell'idea"));
    }
});
exports.getIdeaById = getIdeaById;
const deleteIdea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const authReq = req;
        const userId = (_d = authReq.user) === null || _d === void 0 ? void 0 : _d.id;
        const ideaId = req.params.id;
        //  Verifica validità degli ID
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid UserId format"));
            return;
        }
        if (!(0, mongoose_1.isValidObjectId)(ideaId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid IdeaId format"));
            return;
        }
        //  Trova l'idea
        const ideaFound = yield idea_1.Idea.findById({ _id: ideaId });
        if (!ideaFound) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Idea not found"));
            return;
        }
        //  Controlla che l'utente sia l'autore dell'idea
        const author = ideaFound.author.toString();
        if (!checkUserIsAuthor(author, userId)) {
            res.status(403).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Unauthorized"));
            return;
        }
        yield Promise.all([
            idea_1.Idea.findByIdAndDelete(ideaId),
            vote_1.Vote.deleteMany({ idea: ideaId }) // Cancella tutti i voti associati
        ]);
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, [], "Idea deleted successfully"));
    }
    catch (err) {
        console.error("Errore nella cancellazione dell'idea:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nella cancellazione dell'idea"));
    }
    function checkUserIsAuthor(author, userId) {
        return author === userId;
    }
});
exports.deleteIdea = deleteIdea;
const getIdeasHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        page < 1 ? 1 : page;
        limit > 10 ? 10 : limit;
        const pipeline = (0, db_helpers_1.getIdeasPipeline)(type, page, limit);
        const ideas = yield idea_1.Idea.aggregate(pipeline);
        if (!ideas.length) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], `No ${type} ideas found`));
            return;
        }
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, ideas, `Ideas of type ${type} retrieved successfully`));
    }
    catch (err) {
        console.error("Errore nel recupero delle idee:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel recupero delle idee"));
    }
});
exports.getIdeasHome = getIdeasHome;
