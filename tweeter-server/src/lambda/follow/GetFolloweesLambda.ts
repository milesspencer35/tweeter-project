import { PagedUserItemRequest, UserDto } from "tweeter-shared";
import { PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (request: PagedUserItemRequest<UserDto>): Promise<PagedUserItemResponse<UserDto>> => {
    const followService = new FollowService(new DynamoDAOFactory);
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}
