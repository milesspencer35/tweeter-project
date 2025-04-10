import { Status } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";

export const handler = async (event: any) => {
    const statusService = new StatusService(new DynamoDAOFactory);
    let jsonStatus: string = "";

    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        jsonStatus = body;
    }

    const newStatus = Status.fromJson(jsonStatus);
    if (newStatus == null) {
        throw new Error("[Bad Request] PostUpdateFeed got a null status");
    }

    await statusService.sendUpdateFollowerMessages(newStatus);
}