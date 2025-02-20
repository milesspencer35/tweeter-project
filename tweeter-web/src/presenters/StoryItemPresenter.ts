import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryItemPresenter extends StatusItemPresenter {

    protected getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[Status[], boolean]> {
        return this.service.loadMoreStoryItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }
    
    protected getItemDescription(): string {
        return "load story items";
    }
}
