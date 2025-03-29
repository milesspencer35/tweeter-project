import { AuthToken, User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";

export class DynamoUserDAO implements UserDAO {
    getUser(token: string, alias: string): User {
        
    }

    register(firstName: string, lastName: string, alias: string, password: string, userImageString: string, imageFileExtension: string): [User, AuthToken] {
        
    }

    login(alias: string, password: string): [User, AuthToken] {
        
    }

    logout(token: string): void {
        
    }
}