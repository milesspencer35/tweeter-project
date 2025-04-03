import { Follow, User } from "tweeter-shared";

export interface FollowDAO {
    putFollows(followerAlias: string, followeeAlias: string): Promise<void>;
    deleteFollows(followerAlias: string, followeeAlias: string): Promise<void>;
    getFollowsStatus(userAlias: string, selectedUserAlias: string): Promise<boolean>; 
    getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ): Promise<[string[], boolean]>;
    getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined
    ): Promise<[string[], boolean]>;
    getFollowerAliases(userAlias: string): Promise<string[]>;
}
