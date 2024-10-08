import "reflect-metadata";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import Expense from './model/Expense';
import User from "./model/User";

const host = process.env.MYSQL_HOST || "localhost";
const port = process.env.MYSQL_PORT && !Number.isNaN(parseInt(process.env.MYSQL_PORT)) ? parseInt(process.env.MYSQL_PORT) : 3306;
const username = process.env.MYSQL_USER || "root";
const password = process.env.MYSQL_PASSWORD || "root";
const database = process.env.MYSQL_DB || "expense-tracker";

export class AppDataSource {
    private static instance: AppDataSource;

    private dataSource: DataSource;

    private constructor() {
        this.dataSource = new DataSource({
            type: "mysql",
            host: host,
            port: port,
            username: username,
            password: password,
            database: database,
            entities: [Expense, User],
            synchronize: true,
            logging: false,
        });
    }

    private async initialize() {
        try {
            await this.dataSource.initialize();
        } catch (error) {
            console.error('Error during Data Source initialization:', error);
            throw error;
        }
    }

    static async getInstance(): Promise<DataSource> {
        if (this.instance) {
            return this.instance.dataSource;
        }

        this.instance = new AppDataSource();
        await this.instance.initialize();
        return this.instance.dataSource;
    }

    static async getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): Promise<Repository<Entity>> {
        const instance = await this.getInstance();
        return instance.getRepository(entity);
    }
}
