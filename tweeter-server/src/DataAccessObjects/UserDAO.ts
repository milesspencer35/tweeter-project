import { AuthToken, User, UserDto } from "tweeter-shared";

export interface UserDAO {
    register(firstName: string, lastName: string, alias: string, password: string, imageURL: string): Promise<User>;
    getUser(alias: string): Promise<[User | undefined, string | undefined]>;
    getCounts(alias: string): Promise<[number, number]>;
    updateCounts(
        alias: string,
        updateFolloweeAmount: number,
        updateFollowerAmount: number
    ): Promise<[number, number]>;
    batchGetUsers(aliases: string[]): Promise<UserDto[]>;
}