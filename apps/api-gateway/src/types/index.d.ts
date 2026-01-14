import "express"

declare module 'express' {
    interface Request {
        idempotencyKey?: string;
    }
}