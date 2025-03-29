import { User } from "tweeter-shared";

export interface FollowDAO {
    loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): [User[], boolean];
    loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): [User[], boolean];
    getIsFollowerStatus(token: string, user: User, selectedUser: User): boolean;
    getFolloweeCount(token: string, user: User): number;
    getFollowerCount(token: string, user: User): number;
    follow(token: string, userToFollow: User): void;
    unfollow(token: string, userToUnfollow: User): void;
}
