import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { getUserInfo} from "../controllers/user.controller";
import { uploadProfileImage } from "../controllers/user.controller";
import upload from "../config/multer.config";

const router = Router();

router.post("/upload-profile-image", authenticateToken, upload.single("profileImage"), uploadProfileImage);
router.get("/", authenticateToken, getUserInfo);
export default router;
