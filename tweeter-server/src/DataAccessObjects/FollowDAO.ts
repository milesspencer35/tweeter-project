import { Follow, User } from "tweeter-shared";

export interface FollowDAO {
    putFollows(followerAlias: string, followeeAlias: string): Promise<void>;
    deleteFollows(followerAlias: string, followeeAlias: string): Promise<void>; 
}
