import { UserDto } from "tweeter-shared";
import { TweeterService } from "./TweeterService";
import { DAOFactory } from "../../DAOFactories/DAOFactory";

export class FollowService extends TweeterService {
    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.validateToken(token);

        const [aliases, hasMorePages] = await this.followDao.getPageOfFollowers(
            userAlias,
            pageSize,
            lastItem?.alias
        );

        const userDtos = await this.userDao.batchGetUsers(aliases);

        return [userDtos, hasMorePages];
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.validateToken(token);

        const [aliases, hasMorePages] = await this.followDao.getPageOfFollowees(
            userAlias,
            pageSize,
            lastItem?.alias
        );

        const userDtos = await this.userDao.batchGetUsers(aliases);

        return [userDtos, hasMorePages];
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        await this.validateToken(token);

        return await this.followDao.getFollowsStatus(
            user.alias,
            selectedUser.alias
        );
    }

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.validateToken(token);

        const [followee_count] = await this.userDao.getCounts(user.alias);
        return followee_count;
    }

    public async getFollowerCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.validateToken(token);

        const [, follower_count] = await this.userDao.getCounts(user.alias);
        return follower_count;
    }

    public async follow(
        token: string,
        userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const alias = await this.authTokenDao.getAliasByToken(token);
        // insert follow relationship
        await this.followDao.putFollows(alias, userToFollow.alias);
        // update following count for logged in user
        await this.userDao.updateCounts(alias, 1, 0);
        // update and return counts for actioned on user
        return await this.userDao.updateCounts(userToFollow.alias, 0, 1);
    }

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const alias = await this.authTokenDao.getAliasByToken(token);
        // delete the follow relationship
        await this.followDao.deleteFollows(alias, userToUnfollow.alias);
        // update following count for logged in user
        await this.userDao.updateCounts(alias, -1, 0);
        // update and return counts for actioned on user
        return await this.userDao.updateCounts(userToUnfollow.alias, 0, -1);
    }
}
