import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

type UserRaw = {
    username: string;
    password: string;
}

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    constructor(username: string, password: string) {
        this.id = 0; // Managed by TypeORM
        this.username = username;
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public static isRaw(value: unknown): value is UserRaw {
        if (!value || typeof value !== 'object') {
            return false
        }
        const object = value as Record<string, unknown>;

        return (
            typeof object.username === 'string' &&
            typeof object.password === 'string'
        )
    }

    toString(): string {
        return `${this.id}. ${this.username}`;
    }
}
