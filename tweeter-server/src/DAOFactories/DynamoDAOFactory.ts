import { DynamoFollowDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoFollowDAO";
import { DynamoStatusDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoStatusDAO";
import { DynamoUserDAO } from "../DataAccessObjects/DynamoDBDaos/DynamoUserDAO";
import { FollowDAO } from "../DataAccessObjects/FollowDAO";
import { StatusDAO } from "../DataAccessObjects/StatusDAO";
import { UserDAO } from "../DataAccessObjects/UserDAO";
import { DAOFactory } from "./DAOFactory";

export class DynamoDAOFactory implements DAOFactory {
    getFollowDAO(): FollowDAO {
        return new DynamoFollowDAO();
    }

    getUserDAO(): UserDAO {
        return new DynamoUserDAO();
    }

    getStatusDAO(): StatusDAO {
        return new DynamoStatusDAO();
    }
}