import { To, NavigateOptions } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";

export interface LoginView extends LoadingView {
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: (to: To, options?: NavigateOptions) => void;
    // setIsLoading: (value: boolean) => void;
}

export class LoginPresenter extends LoadingPresenter<LoginView> {
    private userService: UserService;

    public constructor(view: LoginView) {
        super(view);
        this.userService = new UserService();
    }

    public async doLogin(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string
    ) {

		this.doFailureReportWithFinally(async () =>
		{
			this.view.setIsLoading(true);

            const [user, authToken] = await this.userService.login(
                alias,
                password
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate("/");
            }
		}, "log user in", () => {});
    }
}
