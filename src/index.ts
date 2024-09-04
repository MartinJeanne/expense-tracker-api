import express from 'express';
import { AppDataSource } from './AppDataSource';
import expenseController from './controller/expenseController';
import authController from './controller/authController';

const app = express();
const port: number = 3000;

app.use('/api/expenses', expenseController);
app.use('/api/auth', authController);

app.listen(port, async () => {
    await AppDataSource.getInstance(); // Init connection to DB
    console.log(`API listening on port ${port}`);
});
