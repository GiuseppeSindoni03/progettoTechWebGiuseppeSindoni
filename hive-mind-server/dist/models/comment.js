"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    idea: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Idea",
        required: true
    },
    content: { type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    timestamp: { type: Date, default: Date.now }
});
exports.Comment = mongoose_1.default.model("Comment", CommentSchema);
