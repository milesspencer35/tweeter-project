import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";


export const handler = async (request: IsFollowerRequest) : Promise<IsFollowerResponse> => {
    const followService = new FollowService(new DynamoDAOFactory);
    const response = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
        success: true,
        message: null,
        isFollower: response
    }
}