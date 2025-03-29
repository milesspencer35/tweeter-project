import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService(new DynamoDAOFactory);
    await statusService.postStatus(request.token, request.newStatus);

    return {
        success: true,
        message: null
    }
}