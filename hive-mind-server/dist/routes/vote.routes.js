"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vote_controller_1 = require("../controllers/vote.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/:id/vote", auth_middleware_1.authenticateToken, vote_controller_1.setVote);
router.get("/:id/vote", auth_middleware_1.authenticateToken, vote_controller_1.getUserVote);
exports.default = router;
