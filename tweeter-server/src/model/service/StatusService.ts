import { AuthToken, Status, FakeData } from "tweeter-shared";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { TweeterService } from "./TweeterService";
import { DAOFactory } from "../../DAOFactories/DAOFactory";

export class StatusService extends TweeterService {
    constructor(daoFactory: DAOFactory) {
        super(daoFactory);
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // return this.getFakeData(lastItem, pageSize);

        this.validateToken(token);

        const [statusItems, hasMorePages] = await this.storyDao.getPageOfStories(userAlias, pageSize, lastItem?.timestamp);
        const dtos = this.mapDtos(statusItems);

        return [dtos, hasMorePages];
    }

    private mapDtos(statusItems: Status[]): StatusDto[] {
        return statusItems.map((status) => status.dto);
    }

    private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        await this.validateToken(token);

        const status = Status.fromDto(newStatus);
        if (status == null) {
            throw new Error("[Bad Request] got status is null");
        }

        await this.storyDao.putStory(status);


        // put it in the feeds it need to go into
    }
}