import Book from '../models/Book.js';
import BookIssue from '../models/BookIssue.js';
import Student from '../models/Student.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import logger from '../utils/logger.js';

class LibraryService {
  // Add a new book
  async addBook(bookData, userId) {
    const existingBook = await Book.findOne({ isbn: bookData.isbn });
    if (existingBook) {
      throw new BadRequestError('Book with this ISBN already exists');
    }

    const book = await Book.create({
      ...bookData,
      addedBy: userId,
      availableCopies: bookData.totalCopies || 1,
    });

    logger.info(`Book added: ${book.title} by user ${userId}`);
    return book;
  }

  // Get all books with filters
  async getAllBooks(filters = {}) {
    const { search, status, category, page = 1, limit = 20 } = filters;

    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find(query)
        .populate('addedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(query),
    ]);

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get book by ID
  async getBookById(bookId) {
    const book = await Book.findById(bookId).populate('addedBy', 'firstName lastName');
    if (!book) {
      throw new NotFoundError('Book not found');
    }
    return book;
  }

  // Update book
  async updateBook(bookId, updateData) {
    const book = await Book.findByIdAndUpdate(
      bookId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!book) {
      throw new NotFoundError('Book not found');
    }

    logger.info(`Book updated: ${book.title}`);
    return book;
  }

  // Delete book (soft delete)
  async deleteBook(bookId) {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    // Check if book is currently issued
    const issuedCount = await BookIssue.countDocuments({
      book: bookId,
      status: { $in: ['ISSUED', 'OVERDUE'] },
    });

    if (issuedCount > 0) {
      throw new BadRequestError('Cannot delete book that is currently issued');
    }

    book.isDeleted = true;
    await book.save();

    logger.info(`Book deleted: ${book.title}`);
    return { message: 'Book deleted successfully' };
  }

  // Issue book to student
  async issueBook(issueData, userId) {
    const { bookId, rollNumber, dueDate } = issueData;

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    if (book.availableCopies === 0) {
      throw new BadRequestError('Book is not available for issue');
    }

    // Find student by roll number (enrollment number)
    const student = await Student.findOne({ enrollmentNumber: rollNumber });
    if (!student) {
      throw new NotFoundError(`Student with roll number ${rollNumber} not found`);
    }

    // Check if student already has this book issued
    const existingIssue = await BookIssue.findOne({
      book: bookId,
      student: student._id,
      status: { $in: ['ISSUED', 'OVERDUE'] },
    });

    if (existingIssue) {
      throw new BadRequestError('Student already has this book issued');
    }

    // Create book issue record
    const bookIssue = await BookIssue.create({
      book: bookId,
      student: student._id,
      rollNumber,
      dueDate: new Date(dueDate),
      issuedBy: userId,
    });

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    // Populate the response
    await bookIssue.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'student', select: 'firstName lastName enrollmentNumber' },
      { path: 'issuedBy', select: 'firstName lastName' },
    ]);

    logger.info(`Book issued: ${book.title} to ${student.firstName} ${student.lastName}`);
    return bookIssue;
  }

  // Return book
  async returnBook(issueId, userId) {
    const bookIssue = await BookIssue.findById(issueId)
      .populate('book')
      .populate('student', 'firstName lastName enrollmentNumber');

    if (!bookIssue) {
      throw new NotFoundError('Book issue record not found');
    }

    if (bookIssue.status === 'RETURNED') {
      throw new BadRequestError('Book already returned');
    }

    // Calculate fine if overdue
    const returnDate = new Date();
    let fine = 0;
    
    if (returnDate > bookIssue.dueDate) {
      const daysOverdue = Math.ceil((returnDate - bookIssue.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysOverdue * 5; // ₹5 per day fine
    }

    // Update book issue record
    bookIssue.returnDate = returnDate;
    bookIssue.status = 'RETURNED';
    bookIssue.fine = fine;
    bookIssue.returnedBy = userId;
    await bookIssue.save();

    // Update book available copies
    const book = await Book.findById(bookIssue.book._id);
    book.availableCopies += 1;
    await book.save();

    logger.info(`Book returned: ${book.title} by ${bookIssue.student.firstName} ${bookIssue.student.lastName}`);
    return bookIssue;
  }

  // Get all issued books
  async getIssuedBooks(filters = {}) {
    const { status, search, page = 1, limit = 20 } = filters;

    const query = {};
    
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['ISSUED', 'OVERDUE'] };
    }

    const skip = (page - 1) * limit;

    const [issues, total] = await Promise.all([
      BookIssue.find(query)
        .populate('book', 'title author isbn')
        .populate('student', 'firstName lastName enrollmentNumber')
        .populate('issuedBy', 'firstName lastName')
        .populate('returnedBy', 'firstName lastName')
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BookIssue.countDocuments(query),
    ]);

    return {
      issues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get library statistics
  async getStatistics() {
    const [
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks,
      totalIssues,
    ] = await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ status: 'AVAILABLE' }),
      Book.countDocuments({ status: 'ISSUED' }),
      BookIssue.countDocuments({ status: 'OVERDUE' }),
      BookIssue.countDocuments(),
    ]);

    return {
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks,
      totalIssues,
    };
  }
}

export default new LibraryService();
