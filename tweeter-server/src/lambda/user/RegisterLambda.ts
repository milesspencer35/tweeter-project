import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
    request: RegisterRequest
): Promise<RegisterResponse> => {
    const userService = new UserService();
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
