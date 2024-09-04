import { Request, Response } from 'express';
import User from '../model/User';
import { AppDataSource } from '../AppDataSource';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register(req: Request, res: Response) {
    res.send('');
}

export async function login(req: Request, res: Response) {
    const body = req.body;
    if (!body) return res.send('No body');
    else if (!User.isRaw(body)) return res.send('Body not expense');
    const userRepo = await AppDataSource.getRepository(User);

    try {
        const foundUser = await userRepo.findOneBy({ username: body.username });
        if (!foundUser) {
            return res.send('Name of user is not correct');
        }

        const isMatch = bcrypt.compareSync(body.password, foundUser.password);
        if (isMatch) {
            const token = jwt.sign({ id: foundUser.id.toString(), username: foundUser.username }, 'salut1', { expiresIn: '2 days', });
            res.send({ username: foundUser.username, token: token });
        } else {
            return res.send('Password is not correct');
        }
    } catch (error) {
        throw error;
    }
}
