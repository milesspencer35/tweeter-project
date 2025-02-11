import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {
    private followService: FollowService;
    private _view: UserInfoView;
    private _isFollower = false;
    private _followeeCount = -1;
    private _followerCount = -1;
    private _isLoading = false;

    public constructor(view: UserInfoView) {
        this.followService = new FollowService();
        this._view = view;
    }

    public get isFollower() {
        return this._isFollower;
    }

    public get followeeCount() {
        return this._followeeCount;
    }

    public get followerCount() {
        return this._followerCount;
    }

    public get isLoading() {
        return this._isLoading;
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this._isFollower = false;
            } else {
                this._isFollower = await this.followService.getIsFollowerStatus(
                    authToken!,
                    currentUser!,
                    displayedUser!
                );
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        try {
            this._followeeCount = await this.followService.getFolloweeCount(
                authToken,
                displayedUser
            );
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        try {
            this._followerCount = await this.followService.getFollowerCount(
                authToken,
                displayedUser
            );
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    }

    public async followDisplayedUser(
        authToken: AuthToken,
        displayedUser: User | null
    ) {
        try {
            this._isLoading = true;
            this._view.displayInfoMessage(
                `Following ${displayedUser!.name}...`,
                0
            );

            const [followerCount, followeeCount] =
                await this.followService.follow(authToken!, displayedUser!);

            this._isFollower = true;
            this._followerCount = followerCount;
            this._followeeCount = followeeCount;
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        } finally {
            this._view.clearLastInfoMessage();
            this._isLoading = false;
        }
    }

    public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User | null) {
        try {
            this._isLoading = true;
            this._view.displayInfoMessage(
              `Unfollowing ${displayedUser!.name}...`,
              0
            );
      
            const [followerCount, followeeCount] = await this.followService.unfollow(
              authToken!,
              displayedUser!
            );
      
            this._isFollower = false;
            this._followerCount = followerCount;
            this._followeeCount = followerCount;
          } catch (error) {
            this._view.displayErrorMessage(
              `Failed to unfollow user because of exception: ${error}`
            );
          } finally {
            this._view.clearLastInfoMessage();
            this._isLoading = false;
          }
    }
}
