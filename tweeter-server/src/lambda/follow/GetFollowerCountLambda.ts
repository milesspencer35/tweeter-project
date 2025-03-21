import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
    const followService = new FollowService();
    const followCount = await followService.getFollowerCount(request.token, request.user);

    return {
        success: true,
        message: null,
        followCount: followCount
    }
}