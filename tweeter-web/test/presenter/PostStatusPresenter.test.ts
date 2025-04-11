import {
    anything,
    capture,
    instance,
    mock,
    spy,
    verify,
    when,
} from "@typestrong/ts-mockito";
import {
    PostStatusPresenter,
    PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;

    let authToken = new AuthToken("abc123", Date.now());
    let user = new User("John", "Doe", "jd", "/");

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(
            new PostStatusPresenter(mockPostStatusViewInstance)
        );
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.statusService).thenReturn(
            mockStatusServiceInstance
        );
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(authToken, "hello world", user);
        verify(
            mockPostStatusView.displayInfoMessage("Posting status...", 0)
        ).once();
    });

    it("calls postStatus on the post status service with correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(authToken, "hello world", user);

        let capturedPostStatus = capture(
            mockStatusService.postStatus
        ).last()[1];
        expect(capturedPostStatus.post).toEqual("hello world");

        verify(mockStatusService.postStatus(authToken, anything())).once();
    });

    it("is successful, the presenter tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
        await postStatusPresenter.submitPost(authToken, "hello world", user);

        await new Promise((resolve) => setTimeout(resolve, 0));

        verify(mockPostStatusView.setPost("")).once();
        verify(
            mockPostStatusView.displayInfoMessage("Status posted!", 2000)
        ).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
    });

    it("is not successful, the presenter tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
        const error = new Error("an error occured");
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(
            error
        );

        await postStatusPresenter.submitPost(authToken, "hello world", user);

        await new Promise((resolve) => setTimeout(resolve, 0));

        verify(
            mockPostStatusView.displayErrorMessage(
                "Failed to post the status because of exception: an error occured"
            )
        ).once();
        verify(mockPostStatusView.setPost("")).never();
        verify(
            mockPostStatusView.displayInfoMessage("Status posted!", 2000)
        ).never();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
    });
});

describe("PostStatus Integration Test", () => {
    let serverFacade: ServerFacade;
    let postStatusPresenter: PostStatusPresenter;
    let mockPostStatusView: PostStatusView;

    beforeEach(() => {
        serverFacade = new ServerFacade();

        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(
            new PostStatusPresenter(mockPostStatusViewInstance)
        );
        postStatusPresenter = instance(postStatusPresenterSpy);
        // postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);
    })


    it("successfully posts a status", async () => {
        const loginRequest = {
            alias: "@Test",
            password: "test",
        };

        const [user, authToken] = await serverFacade.login(loginRequest);

        expect(user).not.toBeNull();
        expect(authToken).not.toBeNull();

        await postStatusPresenter.submitPost(
            authToken,
            "Hello from the test world",
            user!
        );

        await new Promise<void>((resolve) => setTimeout(resolve, 3000));

        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).called();

        const loadMoreStoryItemsRequest = {
            token: authToken.token,
            userAlias: user!.alias,
            pageSize: 1,
            lastItem: null,
        };

        const [statusList, hasMore] = await serverFacade.loadMoreStoryItems(
            loadMoreStoryItemsRequest
        );

        await new Promise<void>((resolve) => setTimeout(resolve, 1000));

        expect(statusList).not.toBeNull();
        expect(statusList[0]).not.toBeNull();
        console.log(statusList[0]);
        expect(statusList[0].post).toBe("Hello from the test world");
    }, 10000);
});
