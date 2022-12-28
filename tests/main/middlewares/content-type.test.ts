import request from "supertest";
import { setupServer } from "../../../src/main/config/server";

describe("Content-Type Middleware", () => {
  let app;

  beforeAll(async () => {
    ({ app } = await setupServer());
  });

  it("should return default content-type as json", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send("");
    });
    await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  it("should return xml content-type when forced", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      res.type("xml");
      res.send("");
    });
    await request(app)
      .get("/test_content_type_xml")
      .expect("content-type", /xml/);
  });
});
