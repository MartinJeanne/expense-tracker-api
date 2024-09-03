import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    const expenseRepo = new ExpenseRepository();
    const expenses = await expenseRepo.findAll();
    console.log('ID  Date  Description  Amount');
    expenses.forEach(exp => exp.print())
}
