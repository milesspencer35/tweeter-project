import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
    const userService = new UserService(new DynamoDAOFactory);
    await userService.logout(request.token);

    return {
        success: true,
        message: null
    };
}