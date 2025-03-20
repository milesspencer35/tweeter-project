import {
    PagedUserItemRequest,
    PagedUserItemResponse,
    PostStatusRequest,
    Status,
    StatusDto,
    TweeterResponse,
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

		return this.morePagedUserItems<User, UserDto>(request, "/followee/list", `No followee found`, User);
    }

    public async getMoreFollowers(
        request: PagedUserItemRequest<UserDto>
    ): Promise<[User[], boolean]> {

		return this.morePagedUserItems<User, UserDto>(request, "/follower/list", `No followers found`, User);
    }

    public async loadMoreFeedItems(
        request: PagedUserItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {

		return this.morePagedUserItems<Status, StatusDto>(request, "/feed/list", `No story found`, Status);
    }

    public async loadMoreStoryItems(
        request: PagedUserItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {

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


	public async postStatus(request: PostStatusRequest): Promise<void> {
		const response = await this.clientCommunicator.doPost<
			PostStatusRequest,
			TweeterResponse
		>(request, "/status/post");

		if (!response.success) {
			console.error(response);
			throw new Error(response.message ?? undefined);
		}
	}
}
