import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView } from "./Presenter";
import { LoadingPresenter } from "./LoadingPresenter";

export interface PostStatusView extends MessageView {
    setIsLoading: (value: boolean) => void;
    setPost: (value: string) => void;
}

export class PostStatusPresenter extends LoadingPresenter<PostStatusView> {
    private statusService: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this.statusService = new StatusService();
    }

    public async submitPost(
        authToken: AuthToken,
        post: string,
        currentUser: User
    ) {
        this.doFailureReportWithFinally(
            async () => {
                this.view.setIsLoading(true);
                this.view.displayInfoMessage("Posting status...", 0);

                const status = new Status(post, currentUser!, Date.now());

                await this.statusService.postStatus(authToken!, status);

                this.view.setPost("");
                this.view.displayInfoMessage("Status posted!", 2000);
            },
            "post the status",
            () => {
                this.view.clearLastInfoMessage();
            }
        );
    }
}
