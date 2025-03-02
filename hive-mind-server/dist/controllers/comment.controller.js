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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIdeaComment = exports.postComment = void 0;
const structure_1 = require("../utils/structure");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
const idea_1 = require("../models/idea");
dotenv_1.default.config();
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        const { ideaId } = req.params;
        const { content } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid UserId format"));
            return;
        }
        if (!(0, mongoose_1.isValidObjectId)(ideaId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid IdeaId format"));
            return;
        }
        const foundIdea = yield idea_1.Idea.findById(ideaId);
        if (!foundIdea) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Idea not found"));
            return;
        }
        if (isCommentEmpty(content)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Comment cannot be empty"));
            return;
        }
        const newComment = {
            author: userId,
            content: content,
            timestamp: new Date()
        };
        foundIdea.comments.push(newComment);
        yield foundIdea.save();
        res.status(201).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, newComment, "Comment added successfully"));
    }
    catch (err) {
        console.error("Errore nel salvataggio del commento:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore interno del server"));
    }
    function isCommentEmpty(commentText) {
        return !commentText || (typeof commentText === "string" && commentText.trim() === "");
    }
});
exports.postComment = postComment;
const deleteIdeaComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { ideaId: ideaId, commentId: commentId } = req.params;
        const authReq = req;
        const userId = (_b = authReq.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid UserId format"));
            return;
        }
        if (!(0, mongoose_1.isValidObjectId)(ideaId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid IdeaId format"));
            return;
        }
        if (!(0, mongoose_1.isValidObjectId)(commentId)) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid CommentId format"));
            return;
        }
        const idea = yield idea_1.Idea.findById(ideaId);
        if (!idea) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Idea not found"));
            return;
        }
        const comment = idea.comments.find(c => c._id && c._id.toString() === commentId);
        if (!comment) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Comment not found"));
            return;
        }
        if (!isUserAuthorizedToDeleteComment(comment.author.toString(), userId, idea.author.toString())) {
            res.status(403).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Unauthorized"));
            return;
        }
        idea.comments.pull({ _id: commentId });
        yield idea.save();
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, [], "Comment deleted successfully"));
    }
    catch (err) {
        console.error("Errore nella cancellazione del commento:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nella cancellazione del commento"));
    }
    function isUserAuthorizedToDeleteComment(commentAuthor, userId, ideaAuthor) {
        return commentAuthor.toString() === userId || ideaAuthor === userId;
    }
});
exports.deleteIdeaComment = deleteIdeaComment;
