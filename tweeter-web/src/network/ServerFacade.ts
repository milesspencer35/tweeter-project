import {
    PagedUserItemRequest,
    PagedUserItemResponse,
    Status,
    StatusDto,
    User,
    UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL =
        "https://aznz3fzel9.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async getMoreFollowees(
        request: PagedUserItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
        // const response = await this.clientCommunicator.doPost<
        //     PagedUserItemRequest<UserDto>,
        //     PagedUserItemResponse<UserDto>
        // >(request, "/followee/list");

        // // Convert the UserDto array returned by ClientCommunicator to a User array
        // const items: User[] | null =
        //     response.success && response.items
        //         ? response.items.map((dto) => User.fromDto(dto) as User)
        //         : null;

        // // Handle errors
        // if (response.success) {
        //     if (items == null) {
        //         throw new Error(`No followees found`);
        //     } else {
        //         return [items, response.hasMore];
        //     }
        // } else {
        //     console.error(response);
        //     throw new Error(response.message ?? undefined);
        // }

		return this.morePagedUserItems<User, UserDto>(request, "/followee/list", `No followee found`, User);
    }

    public async getMoreFollowers(
        request: PagedUserItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
        // const response = await this.clientCommunicator.doPost<
        //     PagedUserItemRequest<UserDto>,
        //     PagedUserItemResponse<UserDto>
        // >(request, "/follower/list");

        // const items: User[] | null =
        //     response.success && response.items
        //         ? response.items.map((dto) => User.fromDto(dto) as User)
        //         : null;

        // if (response.success) {
        //     if (items == null) {
        //         throw new Error(`No followers found`);
        //     } else {
        //         return [items, response.hasMore];
        //     }
        // } else {
        //     console.error(response);
        //     throw new Error(response.message ?? undefined);
        // }
		return this.morePagedUserItems<User, UserDto>(request, "/follower/list", `No followers found`, User);
    }

    public async loadMoreFeedItems(
        request: PagedUserItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
        // const response = await this.clientCommunicator.doPost<
        //     PagedUserItemRequest<StatusDto>,
        //     PagedUserItemResponse<StatusDto>
        // >(request, "/feed/list");

        // const items: Status[] | null =
        //     response.success && response.items
        //         ? response.items.map((dto) => Status.fromDto(dto) as Status)
        //         : null;

        // if (response.success) {
        //     if (items == null) {
        //         throw new Error(`No feed found`);
        //     } else {
        //         return [items, response.hasMore];
        //     }
        // } else {
        //     console.error(response);
        //     throw new Error(response.message ?? undefined);
        // }

		return this.morePagedUserItems<Status, StatusDto>(request, "/feed/list", `No story found`, Status);
    }

    public async loadMoreStoryItems(
        request: PagedUserItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
        // const response = await this.clientCommunicator.doPost<
        //     PagedUserItemRequest<StatusDto>,
        //     PagedUserItemResponse<StatusDto>
        // >(request, "/story/list");

        // const items: Status[] | null =
        //     response.success && response.items
        //         ? response.items.map((dto) => Status.fromDto(dto) as Status)
        //         : null;

        // if (response.success) {
        //     if (items == null) {
        //         throw new Error(`No story found`);
        //     } else {
        //         return [items, response.hasMore];
        //     }
        // } else {
        //     console.error(response);
        //     throw new Error(response.message ?? undefined);
        // }
		return this.morePagedUserItems<Status, StatusDto>(request, "/story/list", `No story found`, Status);
    }

    private async morePagedUserItems<
        Type extends User | Status,
        TypeDto extends UserDto | StatusDto
    >(
        request: PagedUserItemRequest<TypeDto>,
        apiString: string,
        errorString: string,
        TypeClass: { fromDto(dto: TypeDto): Type | null}
    ): Promise<[Type[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest<TypeDto>,
            PagedUserItemResponse<TypeDto>
        >(request, apiString);

        const items: Type[] | null =
            response.success && response.items
                ? response.items.map((dto) => TypeClass.fromDto(dto) as Type)
                : null;

        if (response.success) {
            if (items == null) {
                throw new Error(errorString);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }
}
