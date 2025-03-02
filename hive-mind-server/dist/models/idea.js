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
exports.Idea = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const marked_1 = require("marked");
const jsdom_1 = require("jsdom");
const dompurify_1 = __importDefault(require("dompurify"));
// 🔹 Configura DOMPurify per funzionare in Node.js
const window = new jsdom_1.JSDOM("").window;
const DOMPurify = (0, dompurify_1.default)(window);
const IdeaSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 400
    },
    contentHtml: {
        type: String
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    comments: [{
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                auto: true
            },
            author: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            content: {
                type: String,
                required: true,
                trim: true,
                maxlength: 200
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
});
// 📌 Middleware per convertire Markdown in HTML prima di salvare
IdeaSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.content) {
            const rawHtml = yield (0, marked_1.marked)(this.content); // ✅ Usa await per evitare il problema della Promise
            this.contentHtml = DOMPurify.sanitize(rawHtml); // ✅ Sanitizza HTML per evitare XSS
        }
        next();
    });
});
exports.Idea = mongoose_1.default.model("Idea", IdeaSchema);
