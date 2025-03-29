import { AuthToken, User, FakeData } from "tweeter-shared";
import { TweeterService } from "./TweeterService";
import { DAOFactory } from "../../DAOFactories/DAOFactory";
import bcrypt from "bcryptjs";

export class UserService extends TweeterService {
    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async getUser(token: string, alias: string): Promise<User | null> {
        // check token
        // return user object

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
        try {
            // upload image to s3
            const imageURL = await this.s3Dao.putImage(
                `${alias}.${imageFileExtension}`,
                userImageString
            );

            // create the user
            const user = await this.userDao.register(
                firstName,
                lastName,
                alias,
                password,
                imageURL
            );

            const authToken = await AuthToken.Generate();
            await this.authTokenDao.putAuthToken(authToken);

            return [user, authToken];
        } catch (error) {
            throw new Error("error registering user: " + error);
        }

        // return await this.entryReturnLogic();
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User | null, AuthToken]> {
        try {
            // get the user by alias
            const [user, hashedPassword] = await this.userDao.getUser(alias);

            if (
                user == undefined ||
                hashedPassword == undefined ||
                !(await bcrypt.compare(password, hashedPassword))
            ) {
                return [
                    null,
                    AuthToken.fromDto({ token: "error", timestamp: 0 }),
                ];
            }

            // compare passwords
            // if (!await bcrypt.compare(password, hashedPassword)) {
            //     throw new Error("Login password didn't match");
            // }

            const authToken = await AuthToken.Generate();
            await this.authTokenDao.putAuthToken(authToken);

            // send user and authtoken
            return [user, authToken];
        } catch (error) {
            throw new Error("Error loginning in: " + error);
        }

        // return await this.entryReturnLogic();
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
