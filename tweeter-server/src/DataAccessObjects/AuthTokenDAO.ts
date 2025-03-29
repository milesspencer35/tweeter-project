import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
    putAuthToken(authToken: AuthToken): Promise<void>;
}