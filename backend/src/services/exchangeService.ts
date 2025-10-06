import Exchange, { IExchange } from '../models/Exchange';

export const createExchangeRequest = async (exchangeData: any): Promise<IExchange> => {
    const exchange = new Exchange(exchangeData);
    return await exchange.save();
};

export const getExchangeRequests = async (userId: string, type: 'sent' | 'received', page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    let filter = {};

    if (type === 'sent') {
        filter = { requester: userId };
    } else {
        filter = { owner: userId };
    }

    const exchanges = await Exchange.find(filter)
        .populate('book', 'title author imageUrl')
        .populate('requester', 'username email location rating')
        .populate('owner', 'username email location rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Exchange.countDocuments(filter);

    return {
        exchanges,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    };
};

export const getExchangeById = async (id: string): Promise<IExchange | null> => {
    return await Exchange.findById(id)
        .populate('book', 'title author imageUrl')
        .populate('requester', 'username email location rating')
        .populate('owner', 'username email location rating');
};

export const updateExchangeStatus = async (id: string, status: string, userId: string): Promise<IExchange | null> => {
    const exchange = await Exchange.findById(id);

    if (!exchange || exchange.owner.toString() !== userId) {
        return null;
    }

    return await Exchange.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    ).populate('book', 'title author imageUrl')
        .populate('requester', 'username email location rating')
        .populate('owner', 'username email location rating');
};

export const deleteExchangeRequest = async (id: string, userId: string): Promise<IExchange | null> => {
    const exchange = await Exchange.findById(id);

    if (!exchange || exchange.requester.toString() !== userId) {
        return null;
    }

    return await Exchange.findByIdAndDelete(id);
};