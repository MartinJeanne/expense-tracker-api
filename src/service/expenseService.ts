import { Response } from 'express';
import { AppDataSource } from '../AppDataSource';
import Expense, { Category } from '../model/Expense';
import { CustomRequest } from '../middleware/authMiddleware';
import { getUserEntityFromReq, getUserJWTFromReq } from './authService';
import { Between, FindOperator, LessThan, MoreThan } from 'typeorm';

interface findBy {
    where: {
        user: { id: number },
        createdAt?: Date | FindOperator<Date>,
        category?: Category
    }
}

export async function getExpenses(req: CustomRequest, res: Response) {
    const fromDate = toDateObject(req.query.fromDate);
    const toDate = toDateObject(req.query.toDate);
    const category = req.query.category;
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const currentUser = getUserJWTFromReq(req);

    // category
    const findBy: findBy = { where: { user: { id: currentUser.id } } };
    if (category) {
        if (!Expense.isCateogry(category))
            return res.status(400).send(`Not a category: ${category}`);
        findBy.where.category = category;
    }

    // date
    if (fromDate && toDate) findBy.where.createdAt = Between(fromDate, toDate);
    else if (fromDate) findBy.where.createdAt = MoreThan(fromDate);
    else if (toDate) findBy.where.createdAt = LessThan(toDate);

    const expenses = await expenseRepo.find(findBy);
    res.send(expenses);
}

function toDateObject<T>(value: T): Date | null {
    const regex = /\b(\d{1,2})([wm])\b/g;
    let match;
    if (!value || typeof value !== 'string' || (match = regex.exec(value)) === null)
        return null;

    const number = parseInt(match[1]);
    const letter = match[2]
    const date = new Date();
    if (letter === 'w') date.setDate(date.getDate() - number * 7);
    else if (letter === 'm') date.setMonth(date.getMonth() - number);
    return date
}

export async function postExpenses(req: CustomRequest, res: Response) {
    const body = req.body;
    if (!body) return res.send('No body');
    else if (!Expense.isRaw(body)) return res.send('Body not expense');

    const user = await getUserEntityFromReq(req);
    const newExpense = new Expense(body.description, body.amount, user);
    if (body.category) newExpense.category = body.category;

    const expenseRepo = await AppDataSource.getRepository(Expense);
    const saved = await expenseRepo.save(newExpense);
    res.send(saved);
}

export async function putExpenses(req: CustomRequest, res: Response) {
    const id = parseInt(req.params.id);
    const body = req.body;
    if (!id) return res.status(400).send('No id');
    if (!body) return res.status(400).send('No body');
    else if (!Expense.isRaw(body)) return res.status(400).send('Body is not expense');
    const currentUser = getUserJWTFromReq(req);

    const expenseRepo = await AppDataSource.getRepository(Expense);
    const expense = await expenseRepo.findOne({ where: { id: id }, relations: { user: true } });
    if (!expense) return res.status(404).send();
    if (currentUser.id !== expense.user.id) return res.status(401).send();

    expense.description = body.description;
    expense.amount = body.amount;
    if (body.category) expense.category = body.category;
    const updatedExpense = await expenseRepo.save(expense);
    res.send(updatedExpense);
}

export async function deleteExpenses(req: CustomRequest, res: Response) {
    const id = parseInt(req.params.id);
    if (!id) return res.send('No id');
    const currentUser = getUserJWTFromReq(req);

    const userId = currentUser.id;
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const deleteData = await expenseRepo.delete({ id: id, user: { id: userId } });
    if (deleteData.affected === 0) return res.status(404).send();
    res.status(204).send();
}
