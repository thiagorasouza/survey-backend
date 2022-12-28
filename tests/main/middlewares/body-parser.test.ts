import request from "supertest";
import { setupServer } from "../../../src/main/config/server";

describe("Body Parser Middleware", () => {
  let app;

  beforeAll(async () => {
    ({ app } = await setupServer());
  });

  it("should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post("/test_body_parser")
      .send({ name: "John" })
      .expect({ name: "John" });
  });
});
