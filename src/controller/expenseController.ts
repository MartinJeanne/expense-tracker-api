import express from 'express';
import bodyParser from 'body-parser';
import { deleteExpenses, getExpenses, postExpenses, putExpenses } from '../service/expenseService';

const expenseController = express.Router();
expenseController.use(bodyParser.json());

expenseController.get('/', async (req, res) => {
    await getExpenses(req, res);
});

expenseController.post('/', async (req, res) => {
    await postExpenses(req, res);
});

expenseController.put('/:id', async (req, res) => {
    await putExpenses(req, res);
});

expenseController.delete('/:id', async (req, res) => {
    await deleteExpenses(req, res);
});

export default expenseController;
