import { DAOFactory } from "../../DAOFactories/DAOFactory";
import { FollowDAO } from "../../DataAccessObjects/FollowDAO";
import { StatusDAO } from "../../DataAccessObjects/StatusDAO";
import { UserDAO } from "../../DataAccessObjects/UserDAO";

export class TweeterService {
    protected userDao: UserDAO;
    protected followDao: FollowDAO;
    protected statusDao: StatusDAO;

    constructor(daoFactory: DAOFactory) {
        this.userDao = daoFactory.getUserDAO();
        this.followDao = daoFactory.getFollowDAO();
        this.statusDao = daoFactory.getStatusDAO();
    }
}