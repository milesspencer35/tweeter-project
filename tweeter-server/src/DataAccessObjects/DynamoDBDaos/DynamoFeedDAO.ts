import { Status } from "tweeter-shared";
import { FeedDAO } from "../FeedDAO";
import { BatchWriteCommand, DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient} from "@aws-sdk/client-dynamodb";

export class DynamoFeedDAO implements FeedDAO {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly tableName = "feed";
    private readonly receiverAlias_attr = "receiverAlias";
    private readonly isodate_senderAlias_attr = "isodate_senderAlias";
    private readonly status_attr = "status"

    async batchPutFeedItems(
        followerAliases: string[],
        senderAlias: string,
        status: Status
    ): Promise<void> {
        if (followerAliases && followerAliases.length > 0) {
            // Deduplicate the names (only necessary if used in cases where there can be duplicates)
            // const namesWithoutDuplicates = [...new Set(aliases)];
            const now: Date = new Date();

            for (let i = 0; i < followerAliases.length; i += 25) {
                let aliasCut = followerAliases.slice(i, i + 25);

                const keys = aliasCut.map<Record<string, {}>>(
                    (recieverAlias) => ({
                        [this.receiverAlias_attr]: recieverAlias,
                        [this.isodate_senderAlias_attr]: (now.toISOString() + senderAlias),
                        [this.status_attr]: status.toJson()
                    })
                );
    
                const params = {
                    RequestItems: {
                        [this.tableName]: keys.map((item) => ({
                            PutRequest: {Item: item}
                        }))
                    },
                };
    
                await this.client.send(new BatchWriteCommand(params));
            }

            

            // if (result.Responses) {
            //     return result.Responses[this.tableName].map<UserDto>((item) => {
            //         return {
            //             firstName: item[this.firstName_attr],
            //             lastName: item[this.lastName_attr],
            //             alias: item[this.alias_attr],
            //             imageUrl: item[this.imageURL_attr],
            //         };
            //     });
            // }
        }
    }

    async getPageOfFeed(
        userHandle: string,
        pageSize: number,
        lastItemIsodateSenderAlias: string | undefined
    ): Promise<[Status[], boolean]> {
        const params = {
            KeyConditionExpression: this.receiverAlias_attr + " = :ra",
            ExpressionAttributeValues: {
                ":ra": userHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastItemIsodateSenderAlias === undefined
                    ? undefined
                    : {		
                        [this.receiverAlias_attr]: userHandle,
                        [this.isodate_senderAlias_attr]: lastItemIsodateSenderAlias,
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
