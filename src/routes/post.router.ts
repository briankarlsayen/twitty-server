import { Router } from 'express';
import * as postController from '../controllers/post.controller';
const router = Router();

router.post('/', postController.createPost);
router.get('/', postController.displayPosts);
router.get('/:id', postController.viewPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.archivePost);

export default router;
