import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
    putAuthToken(authToken: AuthToken, alias: string): Promise<void>;
    checkForAuthToken(token: string): Promise<boolean>;
    deleteAuthToken(token: string): Promise<void>;
    getAliasByToken(token: string): Promise<string>;
}