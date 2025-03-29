import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse> => {
    const followService = new FollowService(new DynamoDAOFactory);
    const [followerCount, followeeCount] = await followService.follow(request.token, request.userToActionOn);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}