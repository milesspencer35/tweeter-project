import { AuthTokenDAO } from "../DataAccessObjects/AuthTokenDAO";
import { DynamoAuthTokenDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoAuthTokenDAO";
import { DynamoFeedDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoFeedDAO";
import { DynamoFollowDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoFollowDAO";
import { DynamoStoryDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoStoryDAO";
import { DynamoUserDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoUserDAO";
import { FeedDAO } from "../DataAccessObjects/FeedDAO";
import { FollowDAO } from "../DataAccessObjects/FollowDAO";
import { StoryDAO } from "../DataAccessObjects/StoryDAO";
import { UserDAO } from "../DataAccessObjects/UserDAO";
import { DAOFactory } from "./DAOFactory";

export class DynamoDAOFactory implements DAOFactory {
    getFollowDAO(): FollowDAO {
        return new DynamoFollowDAO();
    }

    getUserDAO(): UserDAO {
        return new DynamoUserDAO();
    }  
    
    getAuthTokenDAO(): AuthTokenDAO {
        return new DynamoAuthTokenDAO();
    }

    getFeedDAO(): FeedDAO {
        return new DynamoFeedDAO();
    }

    getStoryDAO(): StoryDAO {
        return new DynamoStoryDAO();
    }
}