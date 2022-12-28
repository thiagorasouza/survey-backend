import request from "supertest";
import { setupServer } from "../../../src/main/config/server";

describe("CORS Middleware", () => {
  let app;

  beforeAll(async () => {
    ({ app } = await setupServer());
  });

  it("should enable CORS", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    });

    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*");
  });
});
