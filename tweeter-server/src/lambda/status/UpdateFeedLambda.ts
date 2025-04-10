import { Status } from "tweeter-shared";
import { DynamoDAOFactory } from "../../DAOFactories/DynamoDAOFactory";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (event: any) => {
    const statusService = new StatusService(new DynamoDAOFactory);
    let status;
    let batch: string[] = [];

    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        console.log(body);
        const bodyObj = JSON.parse(body);
        status = Status.fromJson(JSON.stringify(bodyObj.status));
        batch = bodyObj.batch;
    }

    if (batch == null || status == null) {
        throw new Error("[Bad Request] error receiving data in UpdateFeed");
    }

    await statusService.batchUpdateFeed(batch, status.user.alias, status);

}