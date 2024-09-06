import { Request, Response } from 'express';
import HTTPError from '../error/HTTPError';

type ErrorResponse = {
    status: number,
    errorJSON: { error: string }
}

export default function globalErrorHandler(err: Error, req: Request, res: Response, next: Function) {
    if (res.headersSent) return next(err);

    const response: ErrorResponse = { status: 500, errorJSON: { error: 'Unexpect error' } };
    if (err instanceof HTTPError) {
        response.status = err.status;
        response.errorJSON.error = err.message;
    }
    res.status(response.status).send(response.errorJSON);
}
