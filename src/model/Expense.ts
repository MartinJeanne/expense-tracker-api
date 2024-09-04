import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type ExpenseRaw = {
    description: string;
    amount: number;
}

@Entity()
export default class Expense {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    description: string;
    @Column('double')
    amount: number;
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;

    constructor(description: string, amount: number) {
        this.id = 0; // Managed by TypeORM
        this.description = description;
        this.amount = amount;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public static isRaw(value: unknown): value is ExpenseRaw {
        if (!value || typeof value !== 'object') {
            return false
        }
        const object = value as Record<string, unknown>;

        return (
            typeof object.description === 'string' &&
            typeof object.amount === 'number'
        )
    }

    toString(): string {
        return `${this.id}. ${this.updatedAt.toLocaleDateString()} "${this.description}" ${this.amount}€`;
    }

    toStringDetail(): string {
        return `${this.id}. "${this.description}": ${this.amount} - created: ${this.createdAt}, updated: ${this.updatedAt}`;
    }

    print() {
        console.log(this.toString());
    }
}
