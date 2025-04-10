import { AuthToken, Status, FakeData } from "tweeter-shared";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { TweeterService } from "./TweeterService";
import { DAOFactory } from "../../DAOFactories/DAOFactory";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export class StatusService extends TweeterService {
    private sqsClient = new SQSClient();

    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.validateToken(token);

        try {
            let lastIsoDate_senderAlias;

            if (lastItem != null) {
                const dateObj = new Date(lastItem?.timestamp);
                lastIsoDate_senderAlias =
                    dateObj.toISOString() + lastItem.user.alias;
            }

            const [statusItems, hasMorePages] =
                await this.feedDao.getPageOfFeed(
                    userAlias,
                    pageSize,
                    lastItem == null ? undefined : lastIsoDate_senderAlias
                );
            const dtos = this.mapDtos(statusItems);

            return [dtos, hasMorePages];
        } catch (error) {
            throw new Error("[Server Error] loading more feed items: " + error);
        }
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        this.validateToken(token);

        try {
            const [statusItems, hasMorePages] =
                await this.storyDao.getPageOfStories(
                    userAlias,
                    pageSize,
                    lastItem?.timestamp
                );
            const dtos = this.mapDtos(statusItems);

            return [dtos, hasMorePages];
        } catch (error) {
            throw new Error(
                "[Server Error] loading more story items: " + error
            );
        }
    }

    private mapDtos(statusItems: Status[]): StatusDto[] {
        return statusItems.map((status) => status.dto);
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        await this.validateToken(token);

        const status = Status.fromDto(newStatus);
        if (status == null) {
            throw new Error("[Bad Request] got status is null");
        }

        await this.storyDao.putStory(status);

        await this.sendMessageToQueue("https://sqs.us-east-1.amazonaws.com/062781275972/SQSPostStatusQueue", status.toJson());
    }

    async sendUpdateFollowerMessages(status: Status ): Promise<void> {
        const followerBatches = await this.getSplitOfFollowerAliases(status.user.alias);

        const messages = followerBatches.map((batch) => {
            return {
                status: status,
                batch: batch
            }
        })

        for (const message of messages) {
            await this.sendMessageToQueue("https://sqs.us-east-1.amazonaws.com/062781275972/UpdateFeedQueue", JSON.stringify(message));
        }
    }

    private async getSplitOfFollowerAliases(alias: string): Promise<string[][]>{
        const allFollowers =  await this.followDao.getFollowerAliases(alias);

        const followerBatches: string[][] = [[]];

        let batchAmount = 0;
        let batchPointer = 0;
        for (let i = 0; i < allFollowers.length; i++) {
            if (batchAmount > 99) {
                followerBatches.push([]);
                batchPointer++;
                batchAmount = 0;
            }

            followerBatches[batchPointer].push(allFollowers[i]);
            batchAmount++;
        }

        return followerBatches;
    }

    async sendMessageToQueue(sqs_url: string, messageBody: string) {

        const params = {
            DelaySeconds: 0,
            MessageBody: messageBody,
            QueueUrl: sqs_url,
        };

        try {
            const data = await this.sqsClient.send(
                new SendMessageCommand(params)
            );
            console.log("Success, message sent. MessageID:", data.MessageId);
        } catch (err) {
            throw err;
        }
    }

    async batchUpdateFeed(batchOfFollowers: string[], senderAlias: string, status: Status): Promise<void> {
        
        await this.feedDao.batchPutFeedItems(
            batchOfFollowers,
            senderAlias,
            status
        );

    }
}
