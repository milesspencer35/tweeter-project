import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
    putAuthToken(authToken: AuthToken): Promise<void>;
    checkForAuthToken(token: string): Promise<boolean>;
    deleteAuthToken(token: string): Promise<void>;
}