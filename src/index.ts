import express from 'express';
import { AppDataSource } from './AppDataSource';
import expenseController from './controller/expenseController';
import authController from './controller/authController';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const port: number = 3000;

app.use('/api/expenses', authMiddleware, expenseController);
app.use('/api/auth', authController);

app.listen(port, async () => {
    await AppDataSource.getInstance(); // Init connection to DB
    console.log(`API listening on port ${port}`);
});
