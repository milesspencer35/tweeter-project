import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowActionRequest extends TweeterRequest {
    userToActionOn: UserDto
}