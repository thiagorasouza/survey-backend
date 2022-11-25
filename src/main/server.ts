import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import app from "./config/app";
import env from "./config/env";

MongoHelper.connect(env.mongoUrl).then(() => {
  app.listen(env.port, () => console.log(`Sever running on ${env.port}`));
});
