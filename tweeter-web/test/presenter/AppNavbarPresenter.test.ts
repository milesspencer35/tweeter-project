import { AuthToken, User } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenters/AppNavbarPresenter"
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarPresenterView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarPresenterView = mock<AppNavbarView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance))
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);

    });

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();
    });

    it("on succesful logout tells the view to clear the last info message and clear the user info", async () => {
        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
        verify(mockAppNavbarPresenterView.clearUserInfo()).once();
        verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
    });

    it("on unsuccessful logout tells the view to display an error message and does not tell it to clear the last info message or clear the user info", async () => {
        const error = new Error("An Error occured");
        when(mockUserService.logout(authToken)).thenThrow(error);
        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarPresenterView.displayErrorMessage("Failed to log user out because of exception: An Error occured")).once();
        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
        verify(mockAppNavbarPresenterView.clearUserInfo()).never();
    })
});