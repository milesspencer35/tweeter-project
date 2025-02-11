import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { useState } from "react";
import { UserView, UserPresenter } from "../../presenters/UserPresenter";

interface UserNavigation {
    navigateToClickedUser: (event: React.MouseEvent) => void;
}

const useUserNavigation = (): UserNavigation => {
    const { displayErrorMessage } = useToastListener();

    const { setDisplayedUser, currentUser, authToken } = useUserInfo();

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        presenter.navigateToUser(event.target.toString());
    };

    const listener: UserView = {
          displayErrorMessage: displayErrorMessage,
          authToken: authToken,
          currentUser: currentUser,
          setDisplayedUser: setDisplayedUser
      }
    
      const [presenter] = useState(new UserPresenter(listener));

    return {
        navigateToClickedUser: (event: React.MouseEvent) => navigateToUser(event),
    };
};

export default useUserNavigation;
