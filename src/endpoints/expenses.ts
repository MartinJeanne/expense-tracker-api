import { Request, Response } from 'express';
import { AppDataSource } from '../AppDataSource';
import Expense from '../entity/Expense';

export async function getExpenses(req: Request, res: Response) {
    const expenseRepo = await AppDataSource.getRepository(Expense);
    const expenses = await expenseRepo.find();
    res.send(expenses);
}

export async function postExpenses(req: Request, res: Response) {
    const body = req.body;
    if (!body) return res.send('No body');
    else if (!Expense.isRaw(body)) return res.send('Body not expense');
    const newExpense = new Expense(body.description, body.amount);

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
    const toUpdate = await expenseRepo.findOneBy({ id: id });
    if (!toUpdate) return res.send(`Expense not found with id: ${id}`);
    /*toUpdate.description = body.description;
    toUpdate.amount = body.amount;

    const updated = await expenseRepo.save(toUpdate);
    res.send(updated);*/
}


export async function deleteExpenses(req: Request, res: Response) {
    const body = req.body;
    if (!body) return res.send('No body');
    else if (!Expense.isRaw(body)) return res.send('Body not expense');
    const newExpense = new Expense(body.description, body.amount);

    const expenseRepo = await AppDataSource.getRepository(Expense);
    const saved = await expenseRepo.save(newExpense);
    res.send(saved);
}
