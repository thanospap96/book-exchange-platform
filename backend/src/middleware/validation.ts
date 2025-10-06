// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        next();
    };
};


export const validateQuery = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.query, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            res.status(400).json({
                message: 'Query validation failed',
                errors
            });
            return;
        }

        next();
    };
};