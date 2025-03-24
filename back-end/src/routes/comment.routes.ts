import {Router} from 'express';
import {  postComment, deleteIdeaComment , getCommentsByIdeaId} from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router: Router = Router();


router.post('/:ideaId/comments', authenticateToken, postComment);
router.delete('/:ideaId/comments/:commentId', authenticateToken, deleteIdeaComment);
router.get("/:id/comments", authenticateToken, getCommentsByIdeaId);



export default router;