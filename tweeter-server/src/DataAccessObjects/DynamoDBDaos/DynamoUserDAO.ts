import { AuthToken, User, UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import {
    BatchGetCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";

export class DynamoUserDAO implements UserDAO {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private tableName = "user";
    private firstName_attr = "firstName";
    private lastName_attr = "lastName";
    private alias_attr = "alias";
    private password_attr = "password";
    private imageURL_attr = "imageURL";
    private followee_count_attr = "followee_count";
    private follower_count_attr = "follower_count";

    async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageURL: string
    ): Promise<User> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.firstName_attr]: firstName,
                [this.lastName_attr]: lastName,
                [this.alias_attr]: alias,
                [this.password_attr]: password,
                [this.imageURL_attr]: imageURL,
                [this.followee_count_attr]: 0,
                [this.follower_count_attr]: 0,
            },
        };
        await this.client.send(new PutCommand(params));

        return new User(firstName, lastName, alias, imageURL);
    }

    async getUser(
        alias: string
    ): Promise<[User | undefined, string | undefined]> {
        const params = {
            TableName: this.tableName,
            Key: { [this.alias_attr]: alias },
        };

        const output = await this.client.send(new GetCommand(params));
        return [
            output.Item == undefined
                ? undefined
                : new User(
                      output.Item[this.firstName_attr],
                      output.Item[this.lastName_attr],
                      output.Item[this.alias_attr],
                      output.Item[this.imageURL_attr]
                  ),
            output.Item == undefined
                ? undefined
                : output.Item[this.password_attr],
        ];
    }

    async getCounts(alias: string): Promise<[number, number]> {
        const params = {
            TableName: this.tableName,
            Key: { [this.alias_attr]: alias },
        };

        const output = await this.client.send(new GetCommand(params));
        if (output.Item == undefined) {
            throw new Error("[Bad Request] trying to get counts");
        }
        return [
            output.Item[this.followee_count_attr],
            output.Item[this.follower_count_attr],
        ];
    }

    async updateCounts(
        alias: string,
        updateFolloweeAmount: number,
        updateFollowerAmount: number
    ): Promise<[number, number]> {
        const params = {
            TableName: this.tableName,
            Key: { [this.alias_attr]: alias },
            UpdateExpression:
                "SET followee_count = followee_count + :eCount, follower_count = follower_count + :rCount",
            ExpressionAttributeValues: {
                ":eCount": updateFolloweeAmount,
                ":rCount": updateFollowerAmount,
            },
            ReturnValues: ReturnValue.ALL_NEW,
        };
        const output = await this.client.send(new UpdateCommand(params));

        if (output.Attributes == undefined) {
            throw new Error("[Bad Request] error updating counts");
        }
        return [
            output.Attributes.followee_count,
            output.Attributes.follower_count,
        ];
    }

    async batchGetUsers(aliases: string[]): Promise<UserDto[]> {
        if (aliases && aliases.length > 0) {
            // Deduplicate the names (only necessary if used in cases where there can be duplicates)
            const namesWithoutDuplicates = [...new Set(aliases)];

            const keys = namesWithoutDuplicates.map<Record<string, {}>>(
                (alias) => ({
                    [this.alias_attr]: alias,
                })
            );

            const params = {
                RequestItems: {
                    [this.tableName]: {
                        Keys: keys,
                    },
                },
            };

            const result = await this.client.send(new BatchGetCommand(params));

            if (result.Responses) {
                return result.Responses[this.tableName].map<UserDto>((item) => {
                    return {
                        firstName: item[this.firstName_attr],
                        lastName: item[this.lastName_attr],
                        alias: item[this.alias_attr],
                        imageUrl: item[this.imageURL_attr],
                    };
                });
            }
        }

        return [];
    }
}
