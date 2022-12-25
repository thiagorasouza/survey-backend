import { Express, Router } from "express";
import { readdirSync } from "node:fs";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    if (
      !file.includes("index.ts") &&
      !file.includes(".test.ts") &&
      !file.includes(".spec.ts") &&
      !file.includes(".js.map")
    ) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
