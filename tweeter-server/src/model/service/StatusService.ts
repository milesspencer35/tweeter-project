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
        await this.validateToken(token);

        let lastIsoDate_senderAlias;

        if (lastItem != null) {
            const dateObj = new Date(lastItem?.timestamp);
            lastIsoDate_senderAlias =
                dateObj.toISOString() + lastItem.user.alias;
        }

        const [statusItems, hasMorePages] = await this.feedDao.getPageOfFeed(
            userAlias,
            pageSize,
            lastItem == null ? undefined : lastIsoDate_senderAlias
        );
        const dtos = this.mapDtos(statusItems);

        return [dtos, hasMorePages];
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {

        this.validateToken(token);

        const [statusItems, hasMorePages] =
            await this.storyDao.getPageOfStories(
                userAlias,
                pageSize,
                lastItem?.timestamp
            );
        const dtos = this.mapDtos(statusItems);

        return [dtos, hasMorePages];
    }

    private mapDtos(statusItems: Status[]): StatusDto[] {
        return statusItems.map((status) => status.dto);
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
        const followerAliases = await this.followDao.getFollowerAliases(
            newStatus.user.alias
        );

        await this.feedDao.batchPutFeedItems(
            followerAliases,
            status.user.alias,
            status
        );
    }
}
