import { Request, Response } from 'express';
import User from '../model/User';
import { AppDataSource } from '../AppDataSource';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../middleware/authMiddleware';
import AlbreadyExistsError from '../error/clientError/AlbreadyExistsError';
import BodyError from '../error/clientError/BodyError';
import NotFoundError from '../error/clientError/NotFoundError';
import JWTError from '../error/serverError/JWTError';
import ExpectedInDatabaseError from '../error/serverError/ExpectedInDatabaseError';

export type UserJWT = {
    id: number;
    username: string;
}

export async function register(req: Request) {
    const body = req.body;
    if (!body) throw new BodyError('No body provided');
    else if (!User.isRaw(body)) throw new BodyError('body is not in user format');

    const userRepo = await AppDataSource.getRepository(User);
    const foundUser = await userRepo.findOneBy({ username: body.username });
    if (foundUser) {
        throw new AlbreadyExistsError('a user with this username');
    }

    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const savedUser = await userRepo.save(new User(body.username, hashedPassword));
    return savedUser;
}

export async function login(req: Request) {
    const body = req.body;
    if (!body) throw new BodyError('No body provided');
    else if (!User.isRaw(body)) throw new BodyError('body is not in user format');

    const userRepo = await AppDataSource.getRepository(User);
    const foundUser = await userRepo.findOneBy({ username: body.username });
    if (!foundUser) {
        throw new NotFoundError(`user with username: ${body.username}`);
    }

    const isMatch = bcrypt.compareSync(body.password, foundUser.password);
    if (isMatch) {
        const user: UserJWT = { id: foundUser.id, username: foundUser.username };
        const secret = process.env.JWT_SECRET;
        if (typeof secret !== 'string')
            throw new JWTError('invalid JWT secret');

        const token = jwt.sign(user, secret, { expiresIn: '30min' });
        return { username: foundUser.username, token: token };
    } else {
        throw new BodyError('incorrect password');
    }
}

export async function getUserEntityFromReq(req: CustomRequest): Promise<User> {
    const userJWT = getUserJWTFromReq(req);
    const userRepo = await AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userJWT.id });
    if (!user) {
        throw new ExpectedInDatabaseError(`user in JWT with id: ${userJWT.id}`);
    }
    return user;
}

function getUserJWTFromReq(req: CustomRequest): UserJWT {
    if (!req.user || !isUserJWT(req.user)) {
        throw new JWTError('user in JWT is not present or not in right format (JWTUser)');
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
