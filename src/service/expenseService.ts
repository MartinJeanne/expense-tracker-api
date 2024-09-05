import { Request, Response } from 'express';
import { AppDataSource } from '../AppDataSource';
import Expense from '../model/Expense';
import { CustomRequest } from '../middleware/authMiddleware';
import User from '../model/User';
import { isJWTUser } from './authService';
import { MoreThan } from 'typeorm';

export async function getExpenses(req: CustomRequest, res: Response) {
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
        return res.send('Internal error, user in JWT is not present or not in right format (JWTUser)');
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

export async function putExpenses(req: CustomRequest, res: Response) {
    const id = parseInt(req.params.id);
    const body = req.body;
    if (!id) return res.send('No id');
    if (!body) return res.send('No body');
    else if (!Expense.isRaw(body)) return res.send('Body is not expense');
    if (!req.user || !isJWTUser(req.user)) {
        return res.send('Internal error, user in JWT is not present or not in right format (JWTUser)');
    }

    const expenseRepo = await AppDataSource.getRepository(Expense);
    const expense = await expenseRepo.findOne({ where: { id: id }, relations: { user: true } });
    if (!expense) return res.status(404).send();
    if (parseInt(req.user.id) !== expense.user.id) return res.status(401).send();

    expense.description = body.description;
    expense.amount = body.amount;
    const updatedExpense = await expenseRepo.save(expense);
    res.send(updatedExpense);
}

export async function deleteExpenses(req: CustomRequest, res: Response) {
    const id = parseInt(req.params.id);
    if (!id) return res.send('No id');
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const expenses = await expenseRepo.delete({ id: id });
    res.status(204).send();
}
