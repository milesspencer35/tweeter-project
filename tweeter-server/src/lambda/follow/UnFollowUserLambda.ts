import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.unfollow(request.token, request.userToActionOn);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}