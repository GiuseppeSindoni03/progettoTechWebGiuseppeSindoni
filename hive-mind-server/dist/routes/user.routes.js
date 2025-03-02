"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const user_controller_2 = require("../controllers/user.controller");
const multer_config_1 = __importDefault(require("../config/multer.config"));
const router = (0, express_1.Router)();
router.post("/upload-profile-image", auth_middleware_1.authenticateToken, multer_config_1.default.single("profileImage"), user_controller_2.uploadProfileImage);
router.get("/", auth_middleware_1.authenticateToken, user_controller_1.getUserInfo);
exports.default = router;
