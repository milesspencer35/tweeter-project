import { AuthToken } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("Status Service", () => {
    let statusService = new StatusService();
    
    it("loadsMoreStoryItems returns correctly", async () => {
        const authToken = new AuthToken("token", 1);

        const [items, hasMore] = await statusService.loadMoreStoryItems(authToken, "@allen", 10, null);

        expect(items).not.toBeNull();
        expect(items.length).toBe(10);
        expect(hasMore).toBe(true);
    });
});