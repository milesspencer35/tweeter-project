import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
    const followService = new FollowService(new DynamoDAOFactory);
    const followCount = await followService.getFollowerCount(request.token, request.user);

    return {
        success: true,
        message: null,
        followCount: followCount
    }
}