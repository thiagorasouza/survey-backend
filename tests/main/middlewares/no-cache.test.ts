import request from "supertest";
import { setupServer } from "../../../src/main/config/server";
import { noCache } from "../../../src/main/middlewares/no-cache";

describe("NoCache Middleware", () => {
  let app;

  beforeAll(async () => {
    ({ app } = await setupServer());
  });

  it("should disable caching", async () => {
    app.get("/test_no_cache", noCache, (req, res) => {
      res.send();
    });

    await request(app)
      .get("/test_no_cache")
      .expect(
        "cache-control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      )
      .expect("pragma", "no-cache")
      .expect("expires", "0")
      .expect("surrogate-control", "no-store");
  });
});
