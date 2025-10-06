import { Request, Response } from 'express';
import * as bookService from '../services/bookService';
import { catchAsync } from '../middleware/errorHandler';

export const createBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const bookData = {
        ...req.body,
        owner: (req as any).user._id
    };

    const book = await bookService.createBook(bookData);

    res.status(201).json({
        message: 'Book created successfully',
        book
    });
});

export const getBooks = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { genre, condition, search, page = 1, limit = 10 } = req.query;

    let filters: any = { status: 'available' };

    if (genre) filters.genre = genre;
    if (condition) filters.condition = condition;
    if (search) {
        filters.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } }
        ];
    }

    const result = await bookService.getBooks(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
    );

    res.json(result);
});

export const getBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const book = await bookService.getBookById(id);

    if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return;
    }

    res.json(book);
});

export const updateBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).user._id;

    // First get the book to check ownership
    const book = await bookService.getBookById(id);

    if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return;
    }

    if (book.owner._id.toString() !== userId) {
        res.status(403).json({ message: 'Not authorized to update this book' });
        return;
    }

    const updatedBook = await bookService.updateBook(id, req.body);

    res.json({
        message: 'Book updated successfully',
        book: updatedBook
    });
});

export const deleteBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).user._id;

    // First get the book to check ownership
    const book = await bookService.getBookById(id);

    if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return;
    }

    if (book.owner._id.toString() !== userId) {
        res.status(403).json({ message: 'Not authorized to delete this book' });
        return;
    }

    await bookService.deleteBook(id);

    res.json({ message: 'Book deleted successfully' });
});

export const getUserBooks = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user._id;
    const { page = 1, limit = 10 } = req.query;

    const result = await bookService.getBooksByUser(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
    );

    res.json(result);
});