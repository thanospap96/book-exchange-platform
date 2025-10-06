import { Request, Response } from 'express';
import * as exchangeService from '../services/exchangeService';
import * as bookService from '../services/bookService';
import { catchAsync } from '../middleware/errorHandler';

export const requestExchange = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { bookId, message } = req.body;
    const requesterId = (req as any).user._id;


    const book = await bookService.getBookById(bookId);

    if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return;
    }

    if (book.status !== 'available') {
        res.status(400).json({ message: 'Book is not available for exchange' });
        return;
    }

    if (book.owner._id.toString() === requesterId) {
        res.status(400).json({ message: 'Cannot request exchange for your own book' });
        return;
    }


    const exchangeData = {
        book: bookId,
        requester: requesterId,
        owner: book.owner._id,
        message
    };

    const exchange = await exchangeService.createExchangeRequest(exchangeData);

    await bookService.updateBook(bookId, { status: 'pending' });

    res.status(201).json({
        message: 'Exchange request sent successfully',
        exchange
    });
});

export const getExchangeRequests = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user._id;
    const { type = 'received', page = 1, limit = 10 } = req.query;

    const result = await exchangeService.getExchangeRequests(
        userId,
        type as 'sent' | 'received',
        parseInt(page as string),
        parseInt(limit as string)
    );

    res.json(result);
});

export const getExchange = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const exchange = await exchangeService.getExchangeById(id);

    if (!exchange) {
        res.status(404).json({ message: 'Exchange request not found' });
        return;
    }

    // Check if user is involved in this exchange
    if (exchange.requester._id.toString() !== userId && exchange.owner._id.toString() !== userId) {
        res.status(403).json({ message: 'Not authorized to view this exchange' });
        return;
    }

    res.json(exchange);
});

export const updateExchangeStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user._id;

    const exchange = await exchangeService.updateExchangeStatus(id, status, userId);

    if (!exchange) {
        res.status(404).json({ message: 'Exchange request not found or not authorized' });
        return;
    }

    // Update book status if exchange is accepted or completed
    if (status === 'accepted') {
        await bookService.updateBook(exchange.book._id.toString(), { status: 'exchanged' });
    } else if (status === 'rejected') {
        await bookService.updateBook(exchange.book._id.toString(), { status: 'available' });
    }

    res.json({
        message: 'Exchange status updated successfully',
        exchange
    });
});

export const deleteExchangeRequest = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const exchange = await exchangeService.deleteExchangeRequest(id, userId);

    if (!exchange) {
        res.status(404).json({ message: 'Exchange request not found or not authorized' });
        return;
    }

    // Update book status back to available
    await bookService.updateBook(exchange.book.toString(), { status: 'available' });

    res.json({ message: 'Exchange request deleted successfully' });
});