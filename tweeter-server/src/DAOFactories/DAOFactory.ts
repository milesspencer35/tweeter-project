import { AuthTokenDAO } from "../DataAccessObjects/AuthTokenDAO";
import { FeedDAO } from "../DataAccessObjects/FeedDAO";
import { FollowDAO } from "../DataAccessObjects/FollowDAO"
import { StoryDAO } from "../DataAccessObjects/StoryDAO";
import { UserDAO } from "../DataAccessObjects/UserDAO";

export interface DAOFactory {
    getFollowDAO(): FollowDAO,
    getUserDAO(): UserDAO,
    getAuthTokenDAO(): AuthTokenDAO,
    getFeedDAO(): FeedDAO,
    getStoryDAO(): StoryDAO
 }