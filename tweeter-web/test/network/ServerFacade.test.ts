import { User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {
    let serverFacade: ServerFacade;

    beforeEach(() => {
        serverFacade = new ServerFacade();
    })

    it("tests that register return correct user and authToken", async () => {
        const request = {
            firstName: "Allen",
            lastName: "Anderson",
            alias: "@allen",
            password: "Donny123",
            userImageString: "donald in string form",
            imageFileExtension: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
        }

        const [user, authToken] = await serverFacade.register(request);

        expect(user).not.toBeNull();
        expect(user?.firstName).toBe("Allen");
        expect(user?.lastName).toBe("Anderson");
        expect(user?.alias).toBe("@allen");
        expect(user?.imageUrl).toBe("https://tweeter-mspencer.s3.us-east-1.amazonaws.com/image/@allen.https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");

        expect(authToken).not.toBeNull();
        expect(authToken.token).toBeDefined();
        expect(authToken.timestamp).toBeGreaterThan(0);
    });

    // it("tests that GetFollowers returns 10 users and hasMore", async () => {
    //     const request = {
    //         token: "myToken",
    //         userAlias: "@allen",
    //         pageSize: 10,
    //         lastItem: null
    //     }

    //     const [users, hasMore] = await serverFacade.getMoreFollowers(request);

    //     expect(users).not.toBeNull();
    //     expect(users.length).toBe(10);
    //     expect(hasMore).toBe(true);
    // });

    // it("tests that GetFollowingCount returns a number", async () => {
    //     const user = new User("Allen", "Anderson", "@allen", "myimage.png");
    //     const request = {
    //         token: "myToken",
    //         user: user
    //     }

    //     const followingCount = await serverFacade.followeeCount(request);

    //     expect(followingCount).not.toBeNull();
    //     expect(followingCount).toBeGreaterThan(0);
    // });

    // it("tests that GetFollowersCount returns a number", async () => {
    //     const user = new User("Allen", "Anderson", "@allen", "myimage.png");
    //     const request = {
    //         token: "myToken",
    //         user: user
    //     }

    //     const followersCount = await serverFacade.followerCount(request);

    //     expect(followersCount).not.toBeNull();
    //     expect(followersCount).toBeGreaterThan(0);
    // });
})