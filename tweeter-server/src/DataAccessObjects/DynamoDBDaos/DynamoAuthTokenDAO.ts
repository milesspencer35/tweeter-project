import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private tableName = "auth_token";
    private token_attr = "token_string";
    private timestamp_attr = "timestamp";
    private expire_attr = "expire_at";

    async putAuthToken(authToken: AuthToken): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.token_attr]: authToken.token,
                [this.timestamp_attr]: authToken.timestamp,
                [this.expire_attr]: ((authToken.timestamp + 14400000) / 1000) // add 4 hours and conver to epoch time
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async checkForAuthToken(token: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: { [this.token_attr]: token }
        };

        const output = await this.client.send(new GetCommand(params));

        if (output.Item == undefined ||
            (Date.now() - output.Item[this.token_attr]) > 14400000
        ) {
            return false;
        }

        return true
    }

    async deleteAuthToken(token: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: { [this.token_attr]: token }
        };

        await this.client.send(new DeleteCommand(params));
    }

}
