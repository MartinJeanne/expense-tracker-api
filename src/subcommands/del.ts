import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    const id = options.id;
    if (Number.isNaN(id)) return console.warn('ID value is not a valid number')

    const expenseRepo = new ExpenseRepository();
    const deleted = await expenseRepo.deleteById(id);
    if (!deleted) console.warn(`No expense with id: ${id}`);
}
