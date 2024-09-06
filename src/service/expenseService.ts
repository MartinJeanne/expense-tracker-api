import { AppDataSource } from '../AppDataSource';
import Expense, { Category } from '../model/Expense';
import { CustomRequest } from '../middleware/authMiddleware';
import { getUserEntityFromReq } from './authService';
import { Between, FindOperator, LessThan, MoreThan } from 'typeorm';
import QueryParamError from '../error/clientError/QueryParamError';
import BodyError from '../error/clientError/BodyError';
import PathParamError from '../error/clientError/PathParamError';
import NotFoundError from '../error/clientError/NotFoundError';
import UnauthorizedError from '../error/clientError/UnauthorizedError';

interface findBy {
    where: {
        user: { id: number },
        createdAt?: Date | FindOperator<Date>,
        category?: Category
    }
}

export async function getExpenses(req: CustomRequest) {
    const fromDate = toDateObject(req.query.fromDate);
    const toDate = toDateObject(req.query.toDate);
    const category = req.query.category;
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const currentUser = await getUserEntityFromReq(req);

    // category
    const findBy: findBy = { where: { user: { id: currentUser.id } } };
    if (category) {
        if (!Expense.isCateogry(category))
            throw new QueryParamError(`not a category: ${category}`);
        findBy.where.category = category;
    }

    // date
    if (fromDate && toDate) findBy.where.createdAt = Between(fromDate, toDate);
    else if (fromDate) findBy.where.createdAt = MoreThan(fromDate);
    else if (toDate) findBy.where.createdAt = LessThan(toDate);

    const expenses = await expenseRepo.find(findBy);
    return expenses;
}

export async function postExpenses(req: CustomRequest) {
    const body = req.body;
    if (!body) throw new BodyError('no body provided');
    else if (!Expense.isRaw(body)) throw new BodyError('body is not in expense format');

    const user = await getUserEntityFromReq(req);
    const newExpense = new Expense(body.description, body.amount, user);
    if (body.category) newExpense.category = body.category;

    const expenseRepo = await AppDataSource.getRepository(Expense);
    const saved = await expenseRepo.save(newExpense);
    return saved;
}

export async function putExpenses(req: CustomRequest) {
    const id = parseInt(req.params.id);
    const body = req.body;
    if (!id) throw new PathParamError('no ID provided');
    if (!body) throw new BodyError('no body provided');
    else if (!Expense.isRaw(body)) throw new BodyError('body is not in expense format');
    const currentUser = await getUserEntityFromReq(req);

    const expenseRepo = await AppDataSource.getRepository(Expense);
    const expense = await expenseRepo.findOne({ where: { id: id }, relations: { user: true } });
    if (!expense) throw new NotFoundError(`expense with id: ${id}`);
    if (currentUser.id !== expense.user.id) throw new UnauthorizedError();

    expense.description = body.description;
    expense.amount = body.amount;
    if (body.category) expense.category = body.category;
    const updatedExpense = await expenseRepo.save(expense);
    return updatedExpense;
}

export async function deleteExpenses(req: CustomRequest) {
    const id = parseInt(req.params.id);
    if (!id) throw new PathParamError('no ID provided');
    const currentUser = await getUserEntityFromReq(req);

    const userId = currentUser.id;
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const deleteData = await expenseRepo.delete({ id: id, user: { id: userId } });
    if (deleteData.affected === 0) throw new NotFoundError(`expense with id: ${id}`);
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
    return date;
}
