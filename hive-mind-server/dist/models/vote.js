"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vote = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const VoteSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    idea: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Idea",
        required: true
    },
    valore: { type: Number,
        enum: [1, -1],
        required: true
    }
});
exports.Vote = mongoose_1.default.model("Vote", VoteSchema);
