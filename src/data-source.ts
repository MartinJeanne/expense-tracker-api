import "reflect-metadata"
import { DataSource } from "typeorm"
import Expense from './entity/Expense';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "expense-tracker",
    entities: [Expense],
    synchronize: true,
    logging: false,
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export async function initialize() {
    await AppDataSource.initialize()
        .catch((error) => console.log(error));
}
