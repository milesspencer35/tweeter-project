import { Status } from "tweeter-shared";

export interface FeedDAO {
    batchPutFeedItems(
        followerAliases: string[],
        senderAlias: string,
        status: Status
    ): Promise<void>;
    getPageOfFeed(
        userHandle: string,
        pageSize: number,
        lastItemIsodateSenderAlias: string | undefined
    ): Promise<[Status[], boolean]>;
}
