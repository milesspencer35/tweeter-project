import { AuthToken, User, FakeData } from "tweeter-shared";
import { TweeterService } from "./TweeterService";
import { DAOFactory } from "../../DAOFactories/DAOFactory";
import bcrypt from "bcryptjs";

export class UserService extends TweeterService {
    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async getUser(token: string, alias: string): Promise<User | null> {

        const [user] = await this.userDao.getUser(alias);

        if (!await this.validateToken(token) || user == undefined) {
            return null;
        }

        return user;
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
                    AuthToken.fromDto({ token: "error", timestamp: 0 })
                ];
            }

            const authToken = await AuthToken.Generate();
            await this.authTokenDao.putAuthToken(authToken);

            // send user and authtoken
            return [user, authToken];
        } catch (error) {
            throw new Error("Error loginning in: " + error);
        }
    }

    public async logout(token: string): Promise<void> {

        await this.authTokenDao.deleteAuthToken(token);
    }
}
