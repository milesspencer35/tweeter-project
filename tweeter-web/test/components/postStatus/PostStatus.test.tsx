import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));

describe("PostStatus", () => {
    let mockUser: User;
    let mockAuthToken: AuthToken;

    beforeAll(() => {
        mockUser = mock<User>();
        const mockUserInstance = instance(mockUser);

        mockAuthToken = mock<AuthToken>();
        const mockAuthTokenInstance = instance(mockAuthToken);

        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
          });
    })

    it("starts with the post status and clear buttons disabled", () => {
        const { postStatusButton, clearStatusButton } =
            renderPostStatusAndGetElements();

        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    });

    it("enables text when text field has text", async () => {
        const { postStatusButton, clearStatusButton, statusTextArea, user } =
            renderPostStatusAndGetElements();

        await user.type(await statusTextArea, "hello");

        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();
    });

    it("disables text buttons after text field is cleared", async () => {
        const { postStatusButton, clearStatusButton, statusTextArea, user } =
            renderPostStatusAndGetElements();

        await user.type(await statusTextArea, "add some text");

        expect(postStatusButton).toBeEnabled();
        expect(clearStatusButton).toBeEnabled();

        await user.click(clearStatusButton);

        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
        
    });

    it("calls the presenters postStatus method with correct parameters when Post Status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const mockAuthTokenInstance = instance(mockAuthToken);
        const mockUserInstance = instance(mockUser);

        const { postStatusButton, clearStatusButton, statusTextArea, user } =
        renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(await statusTextArea, "Hello Friends");
        await user.click(postStatusButton);

        verify(mockPresenter.submitPost(mockAuthTokenInstance, "Hello Friends", mockUserInstance)).once();
    });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
        !!presenter ? (
            <PostStatus presenter={presenter} />
            ) : (
            <PostStatus/>
        )
    );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postStatusButton = screen.getByLabelText("postStatusButton");
    const clearStatusButton = screen.getByLabelText("clearStatusButton");
    const statusTextArea = screen.findByLabelText("statusTextArea");

    return { postStatusButton, clearStatusButton, statusTextArea, user };
};
