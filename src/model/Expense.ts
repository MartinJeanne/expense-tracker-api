import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

type ExpenseRaw = {
    description: string;
    amount: number;
};

export enum Category {
    other = 'other',
    groceries = 'groceries',
    leisure = 'leisure',
    electronics = 'electronics',
    utilities = 'utilies',
    clothing = 'clothing',
    health = 'health'
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
    category: Category;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    constructor(description: string, amount: number, user: User, category?: Category) {
        this.id = 0; // Managed by TypeORM
        this.description = description;
        this.amount = amount;
        this.user = user;
        if (category) this.category = category;
        else this.category = Category.other;
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

    public static isCateogry(value: unknown): value is Category {
        if (!value || typeof value !== 'string') {
            return false
        }
        return Object.values(Category).includes(value as Category);
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
