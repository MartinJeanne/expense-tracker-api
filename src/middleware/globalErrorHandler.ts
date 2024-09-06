import { Request, Response } from 'express';
import HTTPError from '../error/HTTPError';
import ServerError from '../error/serverError/ServerError';

type ErrorResponse = {
    status: number,
    errorJSON: { error: string, details?: Error }
}

export default function globalErrorHandler(err: Error, req: Request, res: Response, next: Function) {
    if (res.headersSent) return next(err);

    const error: ErrorResponse = { status: 500, errorJSON: { error: 'An error occured', details: err } };
    if (err instanceof HTTPError) {
        error.status = err.status;
        error.errorJSON.error = err.message;
        delete error.errorJSON.details;
    }
    if (err instanceof ServerError)
        console.error(err);

    res.status(error.status).send(error.errorJSON);
}
