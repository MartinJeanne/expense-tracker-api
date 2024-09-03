import { UNDEFINED_ID } from "../types";

export default class Expense {
    private _id: number;
    private _description: string;
    private _amount: number;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(description: string, amount: number, id?: number, createdAt?: Date, updatedAt?: Date) {
        if (id) this._id = id; // todo better id handling?
        else this._id = UNDEFINED_ID;
        this._description = description;
        this._amount = amount;

        if (createdAt) this._createdAt = createdAt;
        else this._createdAt = new Date();
        if (updatedAt) this._updatedAt = updatedAt;
        else this._updatedAt = new Date();
    }

    get id() {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get description() {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get amount() {
        return this._amount;
    }

    set amount(amount: number) {
        this._amount = amount;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(date: Date) {
        this._updatedAt = date;
    }

    toString(): string {
        return `${this._id}. ${this._updatedAt.toLocaleDateString()} "${this._description}" ${this._amount}€`;
    }

    toStringDetail(): string {
        return `${this._id}. "${this._description}": ${this._amount} - created: ${this._createdAt}, updated: ${this._updatedAt}`;
    }

    print() {
        console.log(this.toString());
    }
}
