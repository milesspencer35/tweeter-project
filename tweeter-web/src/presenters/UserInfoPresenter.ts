import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";

export interface UserInfoView extends LoadingView {
    setIsFollower: (value: boolean) => void;
    setFolloweeCount: (value: number) => void;
    setFollowerCount: (value: number) => void;
}

export class UserInfoPresenter extends LoadingPresenter<UserInfoView> {
    private followService: FollowService;

    public constructor(view: UserInfoView) {
        super(view);
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.followService.getIsFollowerStatus(
                        authToken!,
                        currentUser!,
                        displayedUser!
                    )
                );
            }
        }, "determine follower status");
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            this.view.setFolloweeCount(
                await this.followService.getFolloweeCount(
                    authToken,
                    displayedUser
                )
            );
        }, "get followees count");
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            this.view.setFollowerCount(
                await this.followService.getFollowerCount(
                    authToken,
                    displayedUser
                )
            );
        }, "get followers count");
    }

    public async followDisplayedUser(
        authToken: AuthToken,
        displayedUser: User | null
    ) {
        this.doFailureReportWithFinally(async () => {

            await this.updateFollowStatus(
                "Following",
                true,
                displayedUser!.name,
                () => this.followService.follow(authToken!, displayedUser!)
            );
        }, "follow user");
    }

    public async unfollowDisplayedUser(
        authToken: AuthToken,
        displayedUser: User | null
    ) {
        this.doFailureReportWithFinally(async () => {

            await this.updateFollowStatus(
                "Unfollowing",
                false,
                displayedUser!.name,
                () => this.followService.unfollow(authToken!, displayedUser!)
            );
        }, "unfollow user");
    }

    private async updateFollowStatus(
        followStatusString: string,
        followStatusBool: boolean,
        displayedUserName: string,
        followOperation: () => Promise<[number, number]>
    ) {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(
            `${followStatusString} ${displayedUserName}...`,
            0
        );

        const [followerCount, followeeCount] = await followOperation();

        this.view.setIsFollower(followStatusBool);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
    }
}
