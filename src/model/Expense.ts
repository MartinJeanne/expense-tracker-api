import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

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

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    constructor(description: string, amount: number, user: User) {
        this.id = 0; // Managed by TypeORM
        this.description = description;
        this.amount = amount;
        this.user = user;
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
