

import { FollowDAO } from "../FollowDAO";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient} from "@aws-sdk/client-dynamodb";

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

    async getFollowsStatus(userAlias: string, selectedUserAlias: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.follower_handle_attr]: userAlias,
                [this.followee_handle_attr]: selectedUserAlias
            }
        }

        const output = await this.client.send(new GetCommand(params));

        return output.Item == undefined ? false: true;
    }

    async getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ): Promise<[string[], boolean]> {
        const params = {
            KeyConditionExpression: this.follower_handle_attr + " = :fr",
            ExpressionAttributeValues: {
                ":fr": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFolloweeHandle === undefined
                    ? undefined
                    : {
                          [this.follower_handle_attr]: followerHandle,
                          [this.followee_handle_attr]: lastFolloweeHandle,
                      },
        };

        const followeeAliases: string[] = []; 
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;

        data.Items?.forEach((item) =>
            followeeAliases.push(item[this.followee_handle_attr])
        );

        return [followeeAliases, hasMorePages];
    }

    async getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined
    ): Promise<[string[], boolean]> {
        const params = {
            KeyConditionExpression: this.followee_handle_attr + " = :fe",
            ExpressionAttributeValues: {
                ":fe": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFollowerHandle === undefined
                    ? undefined
                    : {
                          [this.followee_handle_attr]: followeeHandle,
                          [this.follower_handle_attr]: lastFollowerHandle,
                      },
        };

        const followerAliases: string[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;

        data.Items?.forEach((item) =>
            followerAliases.push(item[this.follower_handle_attr])
        );

        return [followerAliases, hasMorePages]
    }
}