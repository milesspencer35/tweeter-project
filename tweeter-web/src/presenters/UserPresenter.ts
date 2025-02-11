import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserView {
    displayErrorMessage: (message: string) => void;
    authToken: AuthToken | null;
    currentUser: User | null;
    setDisplayedUser: (user: User) => void;
}

export class UserPresenter {
    private view: UserView;
    private userService: UserService;

    public constructor(view: UserView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async navigateToUser(
        eventString: string
    ) {
        try {
            // const alias = this.extractAlias(event.target.toString());
            const alias = this.extractAlias(eventString);

            const user = await this.userService.getUser(this.view.authToken!, alias);

            if (!!user) {
                if (this.view.currentUser!.equals(user)) {
                    this.view.setDisplayedUser(this.view.currentUser!);
                } else {
                    this.view.setDisplayedUser(user);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get user because of exception: ${error}`
            );
        }
    }

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    }
}
