import express from 'express';
import subjectController from '../controllers/subject.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public (authenticated) routes
router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getById);

// Admin only routes
// TODO: Add 'authorize' middleware for these
router.post('/', subjectController.create);
router.put('/:id', subjectController.update);
router.delete('/:id', subjectController.delete);
router.post('/:id/assign-faculty', subjectController.assignFaculty);
router.delete('/:id/unassign-faculty/:facultyId', subjectController.unassignFaculty);

export default router;
