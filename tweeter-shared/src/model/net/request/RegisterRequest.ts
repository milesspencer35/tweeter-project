import { TweeterRequest } from "./TweeterRequest";

export interface RegisterRequest {
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageString: string,
    imageFileExtension: string
}