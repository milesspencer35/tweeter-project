
import { Follow } from "tweeter-shared";
import { FollowDAO } from "../FollowDAO";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoFollowDAO implements FollowDAO {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followee_handle_attr = "followee_handle";
    readonly follower_handle_attr = "follower_handle";

    async putFollows(followerAlias: string, followeeAlias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.follower_handle_attr]: followerAlias,
                [this.followee_handle_attr]: followeeAlias
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async deleteFollows(followerAlias: string, followeeAlias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.follower_handle_attr]: followerAlias,
                [this.followee_handle_attr]: followeeAlias
            }
        }
        await this.client.send(new DeleteCommand(params));
    }
}