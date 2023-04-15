import { Router } from 'express';

import auth from './auth.router';
import user from './user.router';
import post from './post.router';
import tag from './tag.router';
import comment from './comment.router';
import protect from '../../middlewares/protect';
import dashboard from './dashboard.router';
const router = Router();

router.use(protect);
router.use('/auth', auth);
router.use('/users', user);
router.use('/posts', post);
router.use('/tags', tag);
router.use('/comments', comment);
router.use('/dashboard', dashboard);

export default router;
