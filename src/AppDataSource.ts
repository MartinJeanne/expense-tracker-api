import "reflect-metadata";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import Expense from './entity/Expense';

export class AppDataSource {
    private static instance: AppDataSource;

    private dataSource: DataSource;

    private constructor() {
        this.dataSource = new DataSource({
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
