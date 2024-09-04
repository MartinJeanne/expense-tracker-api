import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column('double')
    password: number;
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;

    constructor(username: string, password: number) {
        this.id = 0; // Managed by TypeORM
        this.username = username;
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    toString(): string {
        return `${this.id}. ${this.username}`;
    }
}
