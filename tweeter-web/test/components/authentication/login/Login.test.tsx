import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import React from "react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
    it("starts with sign-in button disabled", () => {
        const { signInButton } = renderLoginAndGetElement("/");

        expect(signInButton).toBeDisabled();
    });

    it("enables the sign-in button if both alias and password have fields have text", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElement("/");
        await addTextToFields(user, aliasField, passwordField, signInButton);
    });

    it("disables the sign-in button if either field is cleared", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElement("/");

        await addTextToFields(user, aliasField, passwordField, signInButton);

        await user.clear(await aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(await aliasField, "1");
        expect(signInButton).toBeEnabled();

        await user.clear(await passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "http://someurl.com";
        const alias = "@SomeAlias";
        const password = "myPassword";

        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElement(originalUrl, mockPresenterInstance);

        await user.type(await aliasField, alias);
        await user.type(await passwordField, password);
        await user.click(await signInButton);

        verify(
            mockPresenter.doLogin(alias, password, false, originalUrl)
        ).once();
    });
});

const addTextToFields = async (
    user: UserEvent,
    aliasField: Promise<HTMLElement>,
    passwordField: Promise<HTMLElement>,
    signInButton: HTMLElement
) => {
    await user.type(await aliasField, "a");
    await user.type(await passwordField, "b");

    expect(signInButton).toBeEnabled();
};

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter} />
            ) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
};

const renderLoginAndGetElement = (
    originalUrl: string,
    presenter?: LoginPresenter
) => {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    const aliasField = screen.findByLabelText("alias");
    const passwordField = screen.findByLabelText("password");

    return { signInButton, aliasField, passwordField, user };
};
