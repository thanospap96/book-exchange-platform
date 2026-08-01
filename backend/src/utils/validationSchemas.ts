import Joi from 'joi';

export const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required()
        .messages({'string.alphanum': 'First name must only contain alphanumeric characters',
            'string.min': 'First name must be at least 3 characters long',
            'string.max': 'First name cannot exceed 30 characters',
            'any.required': 'First name is required'
        }),
    lastName: Joi.string().min(2).max(50).required()
        .messages({
            'string.alphanum': 'Last name must only contain alphanumeric characters',
            'string.min': 'Last name must be at least 3 characters long',
            'string.max': 'Last name cannot exceed 30 characters',
            'any.required': 'Last name is required'
        }),
    // username: Joi.string().alphanum().min(3).max(30).required()
    //     .messages({
    //         'string.alphanum': 'Username must only contain alphanumeric characters',
    //         'string.min': 'Username must be at least 3 characters long',
    //         'string.max': 'Username cannot exceed 30 characters',
    //         'any.required': 'Username is required'
    //     }),
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        }),
    location: Joi.string().required()
        .messages({
            'any.required': 'Location is required'
        })
});

// export const registerSchema = Joi.object({
//     firstName: Joi.string().min(2).max(50).required(),
//     lastName: Joi.string().min(2).max(50).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//     location: Joi.string().min(2).required(),
// });

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().valid(
        'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery',
        'Fantasy', 'Biography', 'History', 'Children', 'Other'
    ).required(),
    condition: Joi.string().valid('New', 'Like New', 'Good', 'Fair').required(),
    description: Joi.string().required()
});

export const exchangeSchema = Joi.object({
    bookId: Joi.string().hex().length(24).required(),
    message: Joi.string().max(500).optional()
});

export const bookQuerySchema = Joi.object({
    genre: Joi.string().optional(),
    condition: Joi.string().optional(),
    search: Joi.string().optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
});