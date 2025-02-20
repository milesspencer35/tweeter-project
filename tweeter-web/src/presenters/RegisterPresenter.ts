import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";
import { LoadingPresenter } from "./LoadingPresenter";

export interface RegisterView extends View {
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: NavigateFunction;
    setIsLoading: (value: boolean) => void;
    setImageBytes: (value: Uint8Array) => void;
    setImageUrl: (value: string) => void;
    setImageFileExtension: (value: string) => void;
}

export class RegisterPresenter extends LoadingPresenter<RegisterView> {
    private userService: UserService;

    public constructor(view: RegisterView) {
        super(view);
        this.userService = new UserService();
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {

        this.doFailureReportWithFinally(async () => {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.userService.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this.view.updateUserInfo(
                user,
                user,
                authToken,
                rememberMe
            );
            this.view.navigate("/");
        }, "register user", () => {});
    }

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    }

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);

            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.view.setImageFileExtension(fileExtension);
            }
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    }
}
