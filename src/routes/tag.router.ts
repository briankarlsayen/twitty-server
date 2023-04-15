import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
const router = Router();

router.post('/', tagController.createTag);
router.get('/', tagController.displayTags);
router.put('/status/:id', tagController.updateTagStatus);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.archiveTag);

export default router;
