import { Request, Response } from 'express';
import User from '../model/User';
import { AppDataSource } from '../AppDataSource';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../middleware/authMiddleware';

export type UserJWT = {
    id: number;
    username: string;
}

export async function register(req: Request, res: Response) {
    const body = req.body;
    if (!body) return res.send('No body');
    else if (!User.isRaw(body)) return res.send('Body is not User');

    const userRepo = await AppDataSource.getRepository(User);
    const foundUser = await userRepo.findOneBy({ username: body.username });
    if (foundUser) {
        return res.send('A user with this username albready exist');
    }

    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const savedUser = await userRepo.save(new User(body.username, hashedPassword));
    res.send(savedUser);
}

export async function login(req: Request, res: Response) {
    const body = req.body;
    if (!body) return res.send('No body');
    else if (!User.isRaw(body)) return res.send('Body is not User');

    const userRepo = await AppDataSource.getRepository(User);
    const foundUser = await userRepo.findOneBy({ username: body.username });
    if (!foundUser) {
        return res.send('Incorrect username');
    }

    const isMatch = bcrypt.compareSync(body.password, foundUser.password);
    if (isMatch) {
        const user: UserJWT = { id: foundUser.id, username: foundUser.username };
        const token = jwt.sign(user, 'salut1', { expiresIn: '30min' });
        res.send({ username: foundUser.username, token: token });
    } else {
        return res.send('Password is not correct');
    }
}

export async function getUserEntityFromReq(req: CustomRequest): Promise<User> {
    const userJWT = getUserJWTFromReq(req);
    const userRepo = await AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userJWT.id });
    if (!user) {
        throw new Error('Internal error, user in JWT was not found in databse');
    }
    return user;
}

export function getUserJWTFromReq(req: CustomRequest): UserJWT {
    if (!req.user || !isUserJWT(req.user)) {
        console.error(req.user);
        throw Error('Internal error, user in JWT is not present or not in right format (JWTUser)');
    }
    return req.user;
}

export function isUserJWT(value: unknown): value is UserJWT {
    if (!value || typeof value !== 'object') {
        return false
    }
    const object = value as Record<string, unknown>;

    return (
        typeof object.id === 'number' &&
        typeof object.username === 'string'
    )
}
