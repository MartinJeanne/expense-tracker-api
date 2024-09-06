import { Request, Response } from 'express';
import HTTPError from '../error/HTTPError';

type ErrorResponse = {
    status: number,
    errorJSON: { error: string }
}

export default function globalErrorHandler(error: Error, req: Request, res: Response) {
    const response: ErrorResponse = { status: 500, errorJSON: { error: 'Unexpect error' } };
    if (!(error instanceof Error)) {
        return res.send(response.status).send(response.errorJSON);
    }
    else if (error instanceof HTTPError) {
        response.status = error.status;
        response.errorJSON.error = error.message;
    }
    res.send(response.status).send(response.errorJSON);
}
