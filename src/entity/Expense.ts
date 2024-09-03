import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Expense {
    @PrimaryGeneratedColumn()
    private id: number;
    @Column()
    private description: string;
    @Column('double')
    private amount: number;
    @Column()
    private createdAt: Date;
    @Column()
    private updatedAt: Date;

    constructor(description: string, amount: number) {
        this.id = 0; // Managed by TypeORM
        this.description = description;
        this.amount = amount;
        this.createdAt = new Date();
        this.updatedAt = new Date();
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
