import express from 'express';
import Expense from './entity/Expense';
import { AppDataSource } from './AppDataSource';
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World how are you?')
});

app.listen(3000);


async function test() {
    const expense = new Expense('coucou', 5);
    const dt = await AppDataSource.getInstance();
    const expenseRepo = dt.getRepository(Expense);
    const savedExpenses = await expenseRepo.find();
    console.log("All photos from the db: ", savedExpenses)
}

test();
