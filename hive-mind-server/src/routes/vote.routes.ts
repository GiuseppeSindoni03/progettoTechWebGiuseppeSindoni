import { Router } from "express";
import { setVote, getUserVote } from "../controllers/vote.controller";
import { authenticateToken } from "../middleware/auth.middleware";


const router = Router();

router.post("/:id/vote", authenticateToken ,setVote)
router.get("/:id/vote", authenticateToken, getUserVote);

export default router;
