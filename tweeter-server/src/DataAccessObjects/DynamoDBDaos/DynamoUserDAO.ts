import { AuthToken, User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoUserDAO implements UserDAO {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private tableName = "user";
    private firstName_attr = "firstName";
    private lastName_attr = "lastName";
    private alias_attr = "alias";
    private password_attr = "password";
    private imageURL_attr = "imageURL";
    
    async register(firstName: string, lastName: string, alias: string, password: string, imageURL: string): Promise<User> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.firstName_attr]: firstName,
                [this.lastName_attr]: lastName,
                [this.alias_attr]: alias,
                [this.password_attr]: password,
                [this.imageURL_attr]: imageURL
            },
        };
        await this.client.send(new PutCommand(params));

        return new User(firstName, lastName, alias, imageURL);
    }
    
}