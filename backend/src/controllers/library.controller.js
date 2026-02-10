import { asyncHandler } from '../middlewares/errorHandler.js';
import libraryService from '../services/library.service.js';

export const addBook = asyncHandler(async (req, res) => {
  const book = await libraryService.addBook(req.body, req.user.id);
  res.status(201).json({ success: true, data: book });
});

export const getAllBooks = asyncHandler(async (req, res) => {
  const result = await libraryService.getAllBooks(req.query);
  res.json({ success: true, data: result });
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await libraryService.getBookById(req.params.id);
  res.json({ success: true, data: book });
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await libraryService.updateBook(req.params.id, req.body);
  res.json({ success: true, data: book });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const result = await libraryService.deleteBook(req.params.id);
  res.json({ success: true, message: result.message });
});

export const issueBook = asyncHandler(async (req, res) => {
  const issue = await libraryService.issueBook(req.body, req.user.id);
  res.status(201).json({ success: true, data: issue });
});

export const returnBook = asyncHandler(async (req, res) => {
  const issue = await libraryService.returnBook(req.params.id, req.user.id);
  res.json({ success: true, data: issue });
});

export const getIssuedBooks = asyncHandler(async (req, res) => {
  const result = await libraryService.getIssuedBooks(req.query);
  res.json({ success: true, data: result });
});

export const getStatistics = asyncHandler(async (req, res) => {
  const stats = await libraryService.getStatistics();
  res.json({ success: true, data: stats });
});
