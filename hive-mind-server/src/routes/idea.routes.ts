import { Router } from "express";
import { getIdeas, postIdea, getIdeasByUser, deleteIdea, getIdeasHome } from "../controllers/idea.controller";
import { authenticateToken } from "../middleware/auth.middleware";


const router = Router();

router.get("/", authenticateToken, getIdeas);
router.post("/",authenticateToken, postIdea);
router.get("/my-ideas",authenticateToken, getIdeasByUser);
router.delete("/:id",authenticateToken, deleteIdea);
router.get("/:type",authenticateToken, getIdeasHome);

export default router;
