import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import bcryptjs from "bcryptjs";

export class UserService {
    private serverFacade = new ServerFacade();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // // TODO: Replace with the result of calling server
        // return FakeData.instance.findUserByAlias(alias);
        const request = {
            token: authToken.token,
            alias: alias
        }

        const response = await this.serverFacade.getUser(request);
        return response; 
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(password, salt);

        const request = {
            firstName: firstName, 
            lastName: lastName,
            alias: alias,
            password: hashedPassword,
            userImageString: imageStringBase64,
            imageFileExtension: imageFileExtension
        }

        const [user, authToken]= await this.serverFacade.register(request);

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user, authToken];
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {

        const request = {
            alias: alias,
            password: password
        }

        const [user, authToken] = await this.serverFacade.login(request);

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        return [user, authToken];
    }

    public async logout(authToken: AuthToken): Promise<void> {
        const request = {
            token: authToken.token
        }

        await this.serverFacade.logout(request);
    }
}
