import { To, NavigateOptions } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";
import { AuthenticateUserPresenter, AuthenticateUserView } from "./AuthenticateUserPresenter";

export class LoginPresenter extends AuthenticateUserPresenter<AuthenticateUserView> {

    public constructor(view: AuthenticateUserView) {
        super(view);
    }

    public async doLogin(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string
    ) {
        this.doAuthentication(
            () => this.userService.login(alias, password),
            () => {
                if (!!originalUrl) {
                    this.view.navigate(originalUrl);
                } else {
                    this.view.navigate("/");
                }
            }, rememberMe, "log user in"
        );
    }
}
