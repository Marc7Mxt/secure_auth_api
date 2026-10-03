export class User {
    constructor(
        public readonly id: number | null,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
    ) {}

    static create(firstName: string, lastName: string, email: string, password: string, isActive: boolean): User {
        return new User(
            null,
            firstName,
            lastName,
            email,
            password,
            isActive,
            new Date(),
        );
    }
}