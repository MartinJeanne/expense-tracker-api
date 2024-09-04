import { Request, Response } from 'express';
import User from '../model/User';
import { AppDataSource } from '../AppDataSource';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        return res.send('Name of user is not correct');
    }

    const isMatch = bcrypt.compareSync(body.password, foundUser.password);
    if (isMatch) {
        const token = jwt.sign({ id: foundUser.id.toString(), username: foundUser.username }, 'salut1', { expiresIn: '2 days', });
        res.send({ username: foundUser.username, token: token });
    } else {
        return res.send('Password is not correct');
    }
}
