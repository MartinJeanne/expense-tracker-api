import Expense from "../entity/Expense";
import ExpenseRepository from "../ExpenseRepository";

export default (options: any) => {
    const description = options.description;
    const amount = options.amount;
    if (Number.isNaN(amount)) return console.warn('Amount value is not a valid number')

    const newExpense = new Expense(description, amount);
    const expenseRepo = new ExpenseRepository();
    expenseRepo.save(newExpense);
}
