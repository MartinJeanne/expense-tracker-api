import express from 'express';
import Expense from './entity/Expense';
import { AppDataSource, initialize } from './data-source';
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World how are you?')
});

app.listen(3000);


async function test() {
    const expense = new Expense('coucou', 5);
    await initialize();
    await AppDataSource.manager.save(expense);
    const expenseRepo = AppDataSource.getRepository(Expense);
    const savedExpenses = await expenseRepo.find();
    console.log("All photos from the db: ", savedExpenses)
}

test();
