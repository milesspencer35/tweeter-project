import {
	AuthToken,
	FollowActionRequest,
	FollowActionResponse,
	FollowCountRequest,
	FollowCountResponse,
	GetUserRequest,
	GetUserResponse,
	IsFollowerRequest,
    IsFollowerResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    PostStatusRequest,
    RegisterRequest,
    EntryResponse,
    Status,
    StatusDto,
    TweeterResponse,
    User,
    UserDto,
	LoginRequest,
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

	public async isFollower(request: IsFollowerRequest): Promise<boolean> {
		const response = await this.clientCommunicator.doPost<
			IsFollowerRequest,
			IsFollowerResponse
		>(request, "/follower/isfollower");

		return this.responseDecision<boolean>(response, response.isFollower);
	}

	public async followeeCount(request: FollowCountRequest): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			FollowCountRequest,
			FollowCountResponse
		>(request, "/followee/count");

		return this.responseDecision<number>(response, response.followCount);
	}

	public async followerCount (request: FollowCountRequest): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			FollowCountRequest,
			FollowCountResponse
		>(request, "/follower/count");

		return this.responseDecision<number>(response, response.followCount);
	}

	public async follow(request: FollowActionRequest): Promise<[number, number]> {
		const response = await this.clientCommunicator.doPost<
			FollowActionRequest,
			FollowActionResponse
		>(request, "/action/follow");

		return this.responseDecision<[number, number]>(response, [response.followerCount, response.followeeCount]);
	}

	public async unfollow(request: FollowActionRequest): Promise<[number, number]> {
		const response = await this.clientCommunicator.doPost<
			FollowActionRequest,
			FollowActionResponse
		>(request, "/action/unfollow");

		return this.responseDecision<[number, number]>(response, [response.followerCount, response.followeeCount])
	}

	public async getUser(request: GetUserRequest): Promise<User | null> {
		const response = await this.clientCommunicator.doPost<
			GetUserRequest,
			GetUserResponse
		>(request, "/user/get");

		const returnVal = response == null ? null : User.fromDto(response.user);
		return this.responseDecision<User | null>(response, returnVal);
	}

	public async register(request: RegisterRequest): Promise<[User | null, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			RegisterRequest,
			EntryResponse
		>(request, "/user/register");

		return this.entry(response);

		// const user = response.user == null ? null : User.fromDto(response.user);
		// const authToken = AuthToken.fromDto(response.authToken);

		// return this.responseDecision<[User | null, AuthToken]>(response, [user, authToken]);
	}

	public async login(request: LoginRequest): Promise<[User | null, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			LoginRequest,
			EntryResponse
		>(request, "/user/login");

		return this.entry(response);
	}

	private entry(response: EntryResponse) {
		const user = response.user == null ? null : User.fromDto(response.user);
		const authToken = AuthToken.fromDto(response.authToken);

		return this.responseDecision<[User | null, AuthToken]>(response, [user, authToken]);
	}

	private responseDecision<T>(response: TweeterResponse, returnValue: T): T {
		if (response.success) {
			return returnValue
		} else {
			console.error(response);
			throw new Error(response.message ?? undefined);
		}
	}
}
