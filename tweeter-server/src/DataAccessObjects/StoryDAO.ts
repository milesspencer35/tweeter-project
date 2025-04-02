import { PostSegmentDto, Status, StatusDto } from "tweeter-shared";

export interface StoryDAO {
    putStory(status: Status): Promise<void>;
    getPageOfStories(
        userHandle: string,
        pageSize: number,
        lastItemTimestamp: number | undefined
    ): Promise<[Status[], boolean]>;
}
