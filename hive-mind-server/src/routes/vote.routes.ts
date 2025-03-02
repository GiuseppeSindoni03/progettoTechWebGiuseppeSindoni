import { Router } from "express";
import { setVote } from "../controllers/vote.controller";
import { authenticateToken } from "../middleware/auth.middleware";


const router = Router();

router.post("/:id/vote", authenticateToken ,setVote)

export default router;
