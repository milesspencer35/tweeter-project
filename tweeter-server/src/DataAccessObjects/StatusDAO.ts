import { Status } from "tweeter-shared";

export interface StatusDAO {
    loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): [Status[], boolean],
    loadMoreStoryItems(
       token: string,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null 
    ): [Status[], boolean],
    postStatus(token: string, newStatus: Status):void
} 