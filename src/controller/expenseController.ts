import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { deleteExpenses, getExpenses, postExpenses, putExpenses } from '../service/expenseService';
import globalErrorHandler from '../middleware/globalErrorHandler';

const expenseController = express.Router();
expenseController.use(bodyParser.json());

expenseController.get('/', async (req, res, next) => {
    getExpenses(req)
        .then(result => res.send(result))
        .catch(next);
});

expenseController.post('/', async (req, res, next) => {
    postExpenses(req)
        .then(result => res.send(result))
        .catch(next);
});

expenseController.put('/:id', async (req, res, next) => {
    putExpenses(req)
        .then(result => res.send(result))
        .catch(next);
});

expenseController.delete('/:id', async (req, res, next) => {
    deleteExpenses(req)
        .then(() => res.status(204).send())
        .catch(next);
});

expenseController.use(globalErrorHandler);

export default expenseController;
