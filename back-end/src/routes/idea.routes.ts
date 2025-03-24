import { Router } from "express";
import {  postIdea, getIdeasByUser, deleteIdea, getIdeasHome, getIdeaById } from "../controllers/idea.controller";
import { authenticateToken } from "../middleware/auth.middleware";


const router = Router();

router.post("/",authenticateToken, postIdea);
router.get("/my-ideas",authenticateToken, getIdeasByUser);
router.delete("/:id",authenticateToken, deleteIdea);
router.get("/:id",authenticateToken, getIdeaById);
router.get("/category/:type",authenticateToken, getIdeasHome);

export default router;
