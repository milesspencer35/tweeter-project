import { PostSegmentDto, Status, StatusDto } from "tweeter-shared";
import { StoryDAO } from "../StoryDAO";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoStoryDAO implements StoryDAO {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly tableName = "story";
    private readonly senderAlias_attr = "senderAlias";
    private readonly timestamp_attr = "timestamp";
    private readonly status_attr = "status";

    async putStory(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.senderAlias_attr]: status.user.alias,
                [this.timestamp_attr]: status.timestamp,
                [this.status_attr]: status.toJson(),
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async getPageOfStories(
        userHandle: string,
        pageSize: number,
        lastItemTimestamp: number | undefined
    ): Promise<[Status[], boolean]> {
        const params = {
            KeyConditionExpression: this.senderAlias_attr + " = :sa",
            ExpressionAttributeValues: {
                ":sa": userHandle,
            },
            TableName: this.tableName,
            // IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastItemTimestamp === undefined
                    ? undefined
                    : {		
						[this.senderAlias_attr]: userHandle,
                        [this.timestamp_attr]: lastItemTimestamp,
                      },
        };

        const statusItems: Status[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;

        data.Items?.forEach((item) =>
            statusItems.push(Status.fromJson(item[this.status_attr])!)
        );

        return [statusItems, hasMorePages];
    }
}
