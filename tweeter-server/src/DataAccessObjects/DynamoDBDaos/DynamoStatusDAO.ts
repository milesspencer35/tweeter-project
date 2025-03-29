import { Status } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";

export class DynamoStatusDAO implements StatusDAO {
    loadMoreFeedItems(token: string, userAlias: string, pageSize: number, lastItem: Status | null): [Status[], boolean] {
        
    }

    loadMoreStoryItems(token: string, userAlias: string, pageSize: number, lastItem: Status | null): [Status[], boolean] {
        
    }

    postStatus(token: string, newStatus: Status): void {
        
    }
}