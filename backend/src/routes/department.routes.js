import express from 'express';
import departmentController from '../controllers/department.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', departmentController.getAll);
router.get('/:id/statistics', departmentController.getStatistics); // Must come before /:id
router.get('/:id', departmentController.getById);
router.post('/', departmentController.create);
router.put('/:id', departmentController.update);
router.delete('/:id', departmentController.delete);

export default router;
