import { AuthToken, User } from "tweeter-shared";

export interface UserDAO {
    register(firstName: string, lastName: string, alias: string, password: string, imageURL: string): Promise<User>;
}