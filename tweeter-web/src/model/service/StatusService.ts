import { AuthToken, Status, FakeData } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
    private serverFacade = new ServerFacade();

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {

        const request = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto
        }

        const response = await this.serverFacade.loadMoreFeedItems(request);

        return response
    };
    

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]>{

        const request = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto
        }

        const response = await this.serverFacade.loadMoreStoryItems(request);
        return response;
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {

        const request = {
            token: authToken.token,
            newStatus: newStatus.dto
        }

        await this.serverFacade.postStatus(request);
      };
}
