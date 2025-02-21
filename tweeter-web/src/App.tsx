import "./App.css";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/PagedPresenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/PagedPresenters/FollowerPresenter";
import { FeedItemPresenter } from "./presenters/PagedPresenters/FeedItemPresenter";
import { StoryItemPresenter } from "./presenters/PagedPresenters/StoryItemPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import { PagedItemView } from "./presenters/PagedPresenters/PagedItemPresenter";
import { FollowService } from "./model/service/FollowService";
import UserItem from "./components/userItem/UserItem";
import { StatusService } from "./model/service/StatusService";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
    const { currentUser, authToken } = useUserInfo();

    const isAuthenticated = (): boolean => {
        return !!currentUser && !!authToken;
    };

    return (
        <div>
            <Toaster position="top-right" />
            <BrowserRouter>
                {isAuthenticated() ? (
                    <AuthenticatedRoutes />
                ) : (
                    <UnauthenticatedRoutes />
                )}
            </BrowserRouter>
        </div>
    );
};

const AuthenticatedRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Navigate to="/feed" />} />
                <Route
                    path="feed"
                    element={
                        <ItemScroller<Status, StatusService>
                            key={"FeedScroller"}
                            presenterGenerator={(view: PagedItemView<Status>) =>
                                new FeedItemPresenter(view)
                            }
                            componenetGenerator={(item) => (
                                <StatusItem status={item} />
                            )}
                        />
                    }
                />
                <Route
                    path="story"
                    element={
                        <ItemScroller<Status, StatusService>
                            key={"StoryScroller"}
                            presenterGenerator={(view: PagedItemView<Status>) =>
                                new StoryItemPresenter(view)
                            }
                            componenetGenerator={(item) => (
                                <StatusItem status={item} />
                            )}
                        />
                    }
                />
                <Route
                    path="followees"
                    element={
                        <ItemScroller<User, FollowService>
                            key={"FollweesScroller"}
                            presenterGenerator={(view: PagedItemView<User>) =>
                                new FolloweePresenter(view)
                            }
                            componenetGenerator={(item) => (
                                <UserItem value={item} />
                            )}
                        />
                    }
                />
                <Route
                    path="followers"
                    element={
                        <ItemScroller<User, FollowService>
                            key={"FollowersScroller"}
                            presenterGenerator={(view: PagedItemView<User>) =>
                                new FollowerPresenter(view)
                            }
                            componenetGenerator={(item) => (
                                <UserItem value={item} />
                            )}
                        />
                    }
                />
                <Route path="logout" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/feed" />} />
            </Route>
        </Routes>
    );
};

const UnauthenticatedRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="*"
                element={<Login originalUrl={location.pathname} />}
            />
        </Routes>
    );
};

export default App;
