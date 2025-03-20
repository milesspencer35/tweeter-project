import { AuthToken, User, FakeData } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import { PagedUserItemRequest } from "tweeter-shared";

export class FollowService {
    private serverFacade = new ServerFacade();

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ) {
        const request = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto,
        };

        const response = await this.serverFacade.getMoreFollowees(request);

        return response;
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ) {
        const request = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto,
        };

        const response = await this.serverFacade.getMoreFollowers(request);
        return response;
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {

        const request = {
            token: authToken.token,
            user: user.dto,
            selectedUser: selectedUser.dto
        }

        const response = await this.serverFacade.isFollower(request);
        return response;
    }

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(user.alias);
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(
            authToken,
            userToFollow
        );
        const followeeCount = await this.getFolloweeCount(
            authToken,
            userToFollow
        );

        return [followerCount, followeeCount];
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(
            authToken,
            userToUnfollow
        );
        const followeeCount = await this.getFolloweeCount(
            authToken,
            userToUnfollow
        );

        return [followerCount, followeeCount];
    }
}
