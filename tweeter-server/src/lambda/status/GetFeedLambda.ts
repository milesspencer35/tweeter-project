import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";

export const handler = async (request: PagedUserItemRequest<StatusDto>): Promise<PagedUserItemResponse<StatusDto>> => {
    const statusService = new StatusService();
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}