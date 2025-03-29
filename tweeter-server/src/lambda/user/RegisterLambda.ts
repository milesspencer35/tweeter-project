import { EntryResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (
    request: RegisterRequest
): Promise<EntryResponse> => {
    const userService = new UserService(new DynamoDAOFactory);
    const [user, authToken] = await userService.register(
        request.firstName,
        request.lastName,
        request.alias,
        request.password,
        request.userImageString,
        request.imageFileExtension
    );

    return {
        success: true,
        message: null,
        user: user.dto,
        authToken: authToken.dto
    }
};
