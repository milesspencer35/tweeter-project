import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private tableName = "auth_token";
    private token_attr = "token_string";
    private timestamp_attr = "timestamp";

    async putAuthToken(authToken: AuthToken): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.token_attr]: authToken.token,
                [this.timestamp_attr]: authToken.timestamp,
                
            },
        };
        await this.client.send(new PutCommand(params));
    }

    
}
