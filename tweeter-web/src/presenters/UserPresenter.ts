import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserView extends View {
    authToken: AuthToken | null;
    currentUser: User | null;
    setDisplayedUser: (user: User) => void;
}

export class UserPresenter extends Presenter<UserView> {
    private userService: UserService;

    public constructor(view: UserView) {
        super(view);
        this.userService = new UserService();
    }

    public async navigateToUser(
        eventString: string
    ) {

        this.doFailureReportingOperation(async () => {
            const alias = this.extractAlias(eventString);

            const user = await this.userService.getUser(this.view.authToken!, alias);

            if (!!user) {
                if (this.view.currentUser!.equals(user)) {
                    this.view.setDisplayedUser(this.view.currentUser!);
                } else {
                    this.view.setDisplayedUser(user);
                }
            }
        }, "get user");
    }

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    }
}
