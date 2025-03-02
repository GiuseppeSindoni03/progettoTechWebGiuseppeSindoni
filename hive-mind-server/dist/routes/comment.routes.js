"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/:ideaId/comments', auth_middleware_1.authenticateToken, comment_controller_1.postComment);
router.delete('/:ideaId/comments/:commentId', auth_middleware_1.authenticateToken, comment_controller_1.deleteIdeaComment);
exports.default = router;
