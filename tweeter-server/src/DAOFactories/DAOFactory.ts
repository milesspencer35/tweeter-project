import { FollowDAO } from "../DataAccessObjects/FollowDAO"
import { StatusDAO } from "../DataAccessObjects/StatusDAO";
import { UserDAO } from "../DataAccessObjects/UserDAO";

export interface DAOFactory {
    getFollowDAO(): FollowDAO,
    getUserDAO(): UserDAO,
    getStatusDAO(): StatusDAO
 }