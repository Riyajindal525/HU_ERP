import express from 'express';
import * as libraryController from '../controllers/library.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('LIBRARIAN', 'ADMIN', 'SUPER_ADMIN'));

router.get('/statistics', libraryController.getStatistics);
router.get('/books', libraryController.getAllBooks);
router.post('/books', libraryController.addBook);
router.get('/books/:id', libraryController.getBookById);
router.put('/books/:id', libraryController.updateBook);
router.delete('/books/:id', libraryController.deleteBook);

router.post('/issues', libraryController.issueBook);
router.get('/issues', libraryController.getIssuedBooks);
router.patch('/issues/:id/return', libraryController.returnBook);

export default router;
