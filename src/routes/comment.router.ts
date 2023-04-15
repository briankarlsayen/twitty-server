import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
const router = Router();

router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.archiveComment);

export default router;
