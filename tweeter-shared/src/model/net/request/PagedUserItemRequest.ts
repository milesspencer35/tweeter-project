import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "../response/TweeterResponse";

export interface PagedUserItemRequest<T> extends TweeterResponse{
    readonly token: string,
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: T | null
}