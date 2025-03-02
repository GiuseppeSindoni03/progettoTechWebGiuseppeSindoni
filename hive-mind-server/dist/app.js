"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const idea_routes_1 = __importDefault(require("./routes/idea.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const vote_routes_1 = __importDefault(require("./routes/vote.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Definizione delle rotte
app.use("/ideas", idea_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/ideas", vote_routes_1.default);
app.use("/ideas", comment_routes_1.default);
app.use("/me", user_routes_1.default);
app.get("/", (req, res) => {
    res.send("Hivemind API is running!");
});
exports.default = app;
