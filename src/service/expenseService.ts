import { Request, Response } from 'express';
import { AppDataSource } from '../AppDataSource';
import Expense from '../model/Expense';
import { CustomRequest } from '../middleware/authMiddleware';
import User from '../model/User';
import { isJWTUser } from './authService';
import { MoreThan } from 'typeorm';

export async function getExpenses(req: Request, res: Response) {
    const fromLast = req.query.fromLast;
    const expenseRepo = await AppDataSource.getRepository(Expense);

    let regex = /\b(\d{1,2})([wm])\b/g;
    let match;
    let expenses;
    if (fromLast && typeof fromLast === 'string' && (match = regex.exec(fromLast)) !== null) {
        const number = parseInt(match[1]);
        const letter = match[2]
        const date = new Date();
        if (letter === 'w') date.setDate(date.getDate() - number * 7);
        else if (letter === 'm') date.setMonth(date.getMonth() - number);
        console.log(number + ' ' + letter)
        expenses = await expenseRepo.findBy({ createdAt: MoreThan(date) });
    }
    else expenses = await expenseRepo.find();
    res.send(expenses);
}

export async function postExpenses(req: CustomRequest, res: Response) {
    const body = req.body;
    if (!body) return res.send('No body');
    else if (!Expense.isRaw(body)) return res.send('Body not expense');

    if (!req.user || !isJWTUser(req.user)) {
        return res.send('Internal error, user in JWT is not right format (JWTUser)');
    }
    const userRepo = await AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: parseInt(req.user.id) });
    if (!user) {
        return res.send('Internal error, user in JWT was not found in databse');
    }

    const newExpense = new Expense(body.description, body.amount, user);
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const saved = await expenseRepo.save(newExpense);
    res.send(saved);
}

export async function putExpenses(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const body = req.body;
    if (!id) return res.send('No id');
    if (!body) return res.send('No body');
    else if (!Expense.isRaw(body)) return res.send('Body is not expense');

    const expenseRepo = await AppDataSource.getRepository(Expense);
    const updateData = await expenseRepo.update(id, { description: body.description, amount: body.amount });
    if (updateData.affected === 0) return res.send(`No Expense found for id: ${id}`);
    res.status(204).send();
}

export async function deleteExpenses(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (!id) return res.send('No id');
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const expenses = await expenseRepo.delete({ id: id });
    res.status(204).send();
}
