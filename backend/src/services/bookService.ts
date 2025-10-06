import Book, { IBook } from '../models/Book';

export const createBook = async (bookData: any): Promise<IBook> => {
    const book = new Book(bookData);
    return await book.save();
};

export const getBooks = async (filters: any = {}, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const books = await Book.find(filters)
        .populate('owner', 'username email location rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Book.countDocuments(filters);

    return {
        books,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    };
};

export const getBookById = async (id: string): Promise<IBook | null> => {
    return await Book.findById(id).populate('owner', 'username email location rating');
};

export const updateBook = async (id: string, updateData: any): Promise<IBook | null> => {
    return await Book.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate('owner', 'username email location rating');
};

export const deleteBook = async (id: string): Promise<IBook | null> => {
    return await Book.findByIdAndDelete(id);
};

export const getBooksByUser = async (userId: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const books = await Book.find({ owner: userId })
        .populate('owner', 'username email location rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Book.countDocuments({ owner: userId });

    return {
        books,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    };
};