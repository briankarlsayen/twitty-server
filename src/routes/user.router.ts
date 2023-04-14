import { Router } from 'express';
import * as userController from '../controllers/user.controller';
const router = Router();

router.get('/', userController.displayUsers);
router.get('/token', userController.viewUser);
router.put('/', userController.updateUser);
router.delete('/:id', userController.archiveUser);

export default router;
