import { DAOFactory } from "../../DAOFactories/DAOFactory";
import { AuthTokenDAO } from "../../DataAccessObjects/AuthTokenDAO";
import { FeedDAO } from "../../DataAccessObjects/FeedDAO";
import { FollowDAO } from "../../DataAccessObjects/FollowDAO";
import { StoryDAO } from "../../DataAccessObjects/StoryDAO";
import { UserDAO } from "../../DataAccessObjects/UserDAO";

export class TweeterService {
    protected userDao: UserDAO;
    protected followDao: FollowDAO;
    protected authTokenDao: AuthTokenDAO;
    protected feedDao: FeedDAO;
    protected storyDao: StoryDAO;

    constructor(daoFactory: DAOFactory) {
        this.userDao = daoFactory.getUserDAO();
        this.followDao = daoFactory.getFollowDAO();
        this.authTokenDao = daoFactory.getAuthTokenDAO();
        this.feedDao = daoFactory.getFeedDAO();
        this.storyDao = daoFactory.getStoryDAO();
    }
}