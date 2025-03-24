import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
    public async getUser(
        token: string,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageString: string,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {

        return await this.entryReturnLogic();
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {

        return await this.entryReturnLogic();
    }

    private async entryReturnLogic(): Promise<[User, AuthToken]> {
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        return [user, FakeData.instance.authToken];
    }

    public async logout(token: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    }
}