import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
const router = Router();

router.get('/interactions', dashboardController.displayInteractions);
router.get('/counters', dashboardController.displayCounters);

export default router;
