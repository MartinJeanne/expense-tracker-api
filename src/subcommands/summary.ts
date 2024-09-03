import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    const month = options.month;
    const expenseRepo = new ExpenseRepository();

    let expenses;
    if (month || month === 0) {
        if (Number.isNaN(month)) return console.warn('Month value is not a valid number');
        else if (month > 12 || month < 1) return console.warn('Month must be between 1 and 12..');
        expenses = await expenseRepo.findByMonth(month);
    } else {
        expenses = await expenseRepo.findAll();
    }

    let totalExpenses = 0;
    expenses.forEach(exp => totalExpenses += exp.amount);
    console.log(`Total expenses: ${totalExpenses}€`);
}
