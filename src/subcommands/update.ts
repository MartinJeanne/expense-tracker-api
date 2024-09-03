import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    const id = options.id;
    const description = options.description;
    const amount = options.amount;
    if (!description && !amount) console.log("error: pass at least one of the following options '-d --description <description>', '-a --amount <amount>'");
    if (id && Number.isNaN(id)) return console.warn('ID value is not a valid number')
    if (amount && Number.isNaN(amount)) return console.warn('Amount value is not a valid number')

    const expenseRepo = new ExpenseRepository();
    const expense = await expenseRepo.findById(id);
    if (!expense) return console.warn(`No expense found for id: ${id}`);

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    expense.updatedAt = new Date();
    expenseRepo.save(expense);
}
