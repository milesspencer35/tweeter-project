import { DAOFactory } from "../../DAOFactories/DAOFactory";
import { AuthTokenDAO } from "../../DataAccessObjects/AuthTokenDAO";
import { FeedDAO } from "../../DataAccessObjects/FeedDAO";
import { FollowDAO } from "../../DataAccessObjects/FollowDAO";
import { S3DAO } from "../../DataAccessObjects/S3DAO";
import { StoryDAO } from "../../DataAccessObjects/StoryDAO";
import { UserDAO } from "../../DataAccessObjects/UserDAO";

export class TweeterService {
    protected userDao: UserDAO;
    protected followDao: FollowDAO;
    protected authTokenDao: AuthTokenDAO;
    protected feedDao: FeedDAO;
    protected storyDao: StoryDAO;
    protected s3Dao: S3DAO;

    constructor(daoFactory: DAOFactory) {
        this.userDao = daoFactory.getUserDAO();
        this.followDao = daoFactory.getFollowDAO();
        this.authTokenDao = daoFactory.getAuthTokenDAO();
        this.feedDao = daoFactory.getFeedDAO();
        this.storyDao = daoFactory.getStoryDAO();
        this.s3Dao = daoFactory.getS3DAO();
    }
}