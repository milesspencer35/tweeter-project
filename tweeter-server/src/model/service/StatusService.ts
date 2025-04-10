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
        
        // put it in the feeds it need to go into
        // const followerAliases = await this.followDao.getFollowerAliases(
        //     newStatus.user.alias
        // );

        // await this.feedDao.batchPutFeedItems(
        //     followerAliases,
        //     status.user.alias,
        //     status
        // );
    }

    async sendUpdateFollowerMessages(alias: string): Promise<void> {
        const followerBatches = await this.getSplitOfFollowerAliases(alias);

        for (const batch of followerBatches) {
            await this.sendMessageToQueue("https://sqs.us-east-1.amazonaws.com/062781275972/UpdateFeedQueue", batch.toString());
        }

        console.log("Done sending batches!!");
    }

    private async getSplitOfFollowerAliases(alias: string): Promise<string[][]>{
        const allFollowers =  await this.followDao.getFollowerAliases(alias);

        const followerBatches: string[][] = [[]];

        let batchAmount = 0;
        let batchPointer = 0;
        for (let i = 0; i < allFollowers.length; i++) {
            if (batchAmount > 24) {
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
}
