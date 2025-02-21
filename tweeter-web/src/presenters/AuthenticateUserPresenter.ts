
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";
import { To, NavigateOptions } from "react-router-dom";

export interface AuthenticateUserView extends View {
    setIsLoading: (value: boolean) => void;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: (to: To, options?: NavigateOptions) => void;
}

export class AuthenticateUserPresenter<T extends AuthenticateUserView> extends Presenter<T>{
    protected userService: UserService;

    public constructor(view: T) {
        super(view);
        this.userService = new UserService
    }

    protected doAuthentication(operation: () => Promise<[User, AuthToken]>, navigateOperation: () => void, rememberMe: boolean, errorType: string) {
        this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);

                const [user, authToken] = await operation();

                this.view.updateUserInfo(user, user, authToken, rememberMe);
                
                navigateOperation();
            },
            errorType
        );
    }

}