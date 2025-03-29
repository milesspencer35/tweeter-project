import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { TweeterService } from "./TweeterService";
import { DAOFactory } from "../../DAOFactories/DAOFactory";

export class FollowService extends TweeterService{

    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        // return this.getFakeData(lastItem, pageSize, userAlias);
        return this.followDao.loadMoreFollowers(token, userAlias, pageSize, User.fromDto(lastItem));
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
    }

    private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    }

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async getFollowerCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(user.alias);
    }

    public async follow(
        token: string,
        userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        return await this.getFollowCounts(token, userToFollow);
    }

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        return await this.getFollowCounts(token, userToUnfollow);
    }

    private async getFollowCounts(token: string, user: UserDto): Promise<[number, number]> {
        const followerCount = await this.getFollowerCount(
            token,
            user
        );
        const followeeCount = await this.getFolloweeCount(
            token,
            user
        );

        return [followerCount, followeeCount];
    }
}
