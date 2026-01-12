import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { getStats, getChartData, getActivities } from '../controllers/analyticsController';

const router = Router();

router.get('/stats', protect, getStats);
router.get('/charts', protect, getChartData);
router.get('/activities', protect, getActivities);

export default router;
