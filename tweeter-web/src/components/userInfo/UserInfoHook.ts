import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";
import { AuthToken, User } from "tweeter-shared";

interface UserInfo {
    currentUser: User | null;
    displayedUser: User | null;
    authToken: AuthToken | null;
    setDisplayedUser: ( user: User ) => void;
    clearUserInfo: () => void;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    
}

const useUserInfo = (): UserInfo => {
    const { currentUser, authToken, displayedUser, setDisplayedUser, clearUserInfo, updateUserInfo } =
        useContext(UserInfoContext);

    return {
        currentUser: currentUser,
        authToken: authToken,
        displayedUser: displayedUser,
        setDisplayedUser: (user: User) => setDisplayedUser(user),
        clearUserInfo: () => clearUserInfo(),
        updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) =>
            updateUserInfo(currentUser, displayedUser, authToken, remember)
    }
};

export default useUserInfo;