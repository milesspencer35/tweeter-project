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
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { FeedItemPresenter } from "./presenters/FeedItemPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { StoryItemPresenter } from "./presenters/StoryItemPresenter";

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
                        <StatusItemScroller
                            key={"FeedScroller"}
                            presenterGenerator={(view: StatusItemView) => new FeedItemPresenter(view)}
                        />
                    }
                />
                <Route
                    path="story"
                    element={
                        <StatusItemScroller
                            key={"StoryScroller"}
                            presenterGenerator={(view: StatusItemView) => new StoryItemPresenter(view)}
                        />
                    }
                />
                <Route
                    path="followees"
                    element={
                        <UserItemScroller
                            key={1}
                            presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
                        />
                    }
                />
                <Route
                    path="followers"
                    element={
                        <UserItemScroller
                            key={2}
                            presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
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
