import express from 'express';
import expenseController from './controller/expenseController';
import { AppDataSource } from './AppDataSource';

const app = express();
const port: number = 3000;

app.use('/api/expenses', expenseController);

app.listen(port, async () => {
    await AppDataSource.getInstance(); // Init connection to DB
    console.log(`API listening on port ${port}`);
});
