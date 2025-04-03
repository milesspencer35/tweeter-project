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

        try {
            const [aliases, hasMorePages] = await this.followDao.getPageOfFollowers(
                userAlias,
                pageSize,
                lastItem?.alias
            );

            const userDtos = await this.userDao.batchGetUsers(aliases);

            return [userDtos, hasMorePages];
        } catch (error) {
            throw new Error("[Server Error] loading more followers: " + error);
        }
        
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.validateToken(token);

        try {
            const [aliases, hasMorePages] = await this.followDao.getPageOfFollowees(
                userAlias,
                pageSize,
                lastItem?.alias
            );
    
            const userDtos = await this.userDao.batchGetUsers(aliases);
    
            return [userDtos, hasMorePages];
        } catch (error) {
            throw new Error("[Server Error] loading more followees: " + error);
        }
        
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        await this.validateToken(token);

        try {
            return await this.followDao.getFollowsStatus(
                user.alias,
                selectedUser.alias
            );
        } catch (error) {
            throw new Error("[Server Error] getting follower status: " + error);
        }
        
    }

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.validateToken(token);

        try {
            const [followee_count, ] = await this.userDao.getCounts(user.alias);
            return followee_count;
        } catch (error) {
            throw new Error("[Server Error] getting followee count: " + error);
        }
        
    }

    public async getFollowerCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.validateToken(token);

        try {
            const [, follower_count] = await this.userDao.getCounts(user.alias);
            return follower_count;
        } catch (error) {
            throw new Error("[Server Error] getting follower count: " + error);
        }
    }

    public async follow(
        token: string,
        userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        await this.validateToken(token);

        try {
            const alias = await this.authTokenDao.getAliasByToken(token);
            // insert follow relationship
            await this.followDao.putFollows(alias, userToFollow.alias);
            // update following count for logged in user
            await this.userDao.updateCounts(alias, 1, 0);
            // update and return counts for actioned on user
            return await this.userDao.updateCounts(userToFollow.alias, 0, 1);
        } catch (error) {
            throw new Error("[Server Error] trying to follow user: " + error);
        }
        
    }

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        await this.validateToken(token);

        try {
            const alias = await this.authTokenDao.getAliasByToken(token);
            // delete the follow relationship
            await this.followDao.deleteFollows(alias, userToUnfollow.alias);
            // update following count for logged in user
            await this.userDao.updateCounts(alias, -1, 0);
            // update and return counts for actioned on user
            return await this.userDao.updateCounts(userToUnfollow.alias, 0, -1);
        } catch (error) {
            throw new Error("[Server Error] trying to unfollow user: " + error);
        }
        
    }
}
