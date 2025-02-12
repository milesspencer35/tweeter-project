import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    setIsFollower: (value: boolean) => void;
    setFolloweeCount: (value: number) => void;
    setFollowerCount: (value: number) => void;
    setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter {
    private followService: FollowService;
    private view: UserInfoView;
    // private _isFollower = false;
    // private _followeeCount = -1;
    // private _followerCount = -1;
    // private _isLoading = false;

    public constructor(view: UserInfoView) {
        this.followService = new FollowService();
        this.view = view;
    }

    // public get isFollower() {
    //     return this._isFollower;
    // }

    // public get followeeCount() {
    //     return this._followeeCount;
    // }

    // public get followerCount() {
    //     return this._followerCount;
    // }

    // public get isLoading() {
    //     return this._isLoading;
    // }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                //this._isFollower = false;
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(await this.followService.getIsFollowerStatus(
                    authToken!,
                    currentUser!,
                    displayedUser!
                ));
                // this._isFollower = await this.followService.getIsFollowerStatus(
                //     authToken!,
                //     currentUser!,
                //     displayedUser!
                // );
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        try {
            this.view.setFolloweeCount(await this.followService.getFolloweeCount(
                authToken,
                displayedUser
            ))
            // this._followeeCount = await this.followService.getFolloweeCount(
            //     authToken,
            //     displayedUser
            // );
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        try {
            this.view.setFollowerCount(await this.followService.getFollowerCount(
                authToken,
                displayedUser
            ))
            // this._followerCount = await this.followService.getFollowerCount(
            //     authToken,
            //     displayedUser
            // );
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    }

    public async followDisplayedUser(
        authToken: AuthToken,
        displayedUser: User | null
    ) {
        try {
            this.view.setIsLoading(true);
            // this._isLoading = true;
            this.view.displayInfoMessage(
                `Following ${displayedUser!.name}...`,
                0
            );

            const [followerCount, followeeCount] =
                await this.followService.follow(authToken!, displayedUser!);

            // this._isFollower = true;
            // this._followerCount = followerCount;
            // this._followeeCount = followeeCount;
            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        } finally {
            this.view.clearLastInfoMessage();
            // this._isLoading = false;
            this.view.setIsLoading(false);
        }
    }

    public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User | null) {
        try {
            // this._isLoading = true;
            this.view.setIsLoading(true);
            this.view.displayInfoMessage(
              `Unfollowing ${displayedUser!.name}...`,
              0
            );
      
            const [followerCount, followeeCount] = await this.followService.unfollow(
              authToken!,
              displayedUser!
            );
      
            // this._isFollower = false;
            // this._followerCount = followerCount;
            // this._followeeCount = followerCount;

            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to unfollow user because of exception: ${error}`
            );
          } finally {
            this.view.clearLastInfoMessage();
            this.view.setIsLoading(false);
            //this._isLoading = false;
          }
    }
}
