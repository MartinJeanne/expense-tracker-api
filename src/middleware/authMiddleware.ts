import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'salut1';

export interface CustomRequest extends Request {
    user?: string | JwtPayload;
}

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            } else if (!user) {
                return res.status(401).json({ error: 'User not found in token' });
            }
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};
