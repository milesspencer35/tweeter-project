import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService(new DynamoDAOFactory);
    const user = await userService.getUser(request.token, request.alias);

    return {
        success: true,
        message: null,
        user: user == null ? null : user.dto
    };
}