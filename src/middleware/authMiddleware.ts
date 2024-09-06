import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../error/clientError/UnauthorizedError';
import JWTError from '../error/serverError/JWTError';

export interface CustomRequest extends Request {
    user?: string | JwtPayload;
}

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedError('No token provided');
        }

        const secret = process.env.JWT_SECRET;
        if (typeof secret !== 'string')
            throw new JWTError('invalid JWT secret');

        jwt.verify(token, secret, (err, user) => {
            if (err) {
                throw new UnauthorizedError('Invalid token provided');
            } else if (!user) {
                throw new JWTError('user not found in token');
            }
            req.user = user;
            next();
        });
    } catch (err) {
        next(err);
    }
};
