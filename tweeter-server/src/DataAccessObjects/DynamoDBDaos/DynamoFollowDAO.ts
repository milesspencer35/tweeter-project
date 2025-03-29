
import { FollowDAO } from "../FollowDAO";

export class DynamoFollowDAO implements FollowDAO {
    loadMoreFollowers(token: string, userAlias: string, pageSize: number, lastItem: User | null): [User[], boolean] {
        
    }

    async loadMoreFollowees(token: string, userAlias: string, pageSize: number, lastItem: User | null): [User[], boolean] {
        
    }

    getIsFollowerStatus(token: string, user: User, selectedUser: User): boolean {
        return true;
    }

    getFolloweeCount(token: string, user: User): number {
        return 5;
    }

    getFollowerCount(token: string, user: User): number {
        return 3;
    }

    follow(token: string, userToFollow: User): void {
        
    }

    unfollow(token: string, userToUnfollow: User): void {
        
    }
}