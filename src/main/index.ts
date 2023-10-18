import env from "./config/env";
import { setupServer } from "./config/server";
import { MongoHelper } from "../infra/db/mongodb/mongo-helper";

export async function startServer() {
  await MongoHelper.connect(env.mongoUrl);

  const { server } = await setupServer();

  server.listen(env.port, () =>
    console.log(`Sever running on http://localhost:${env.port}`)
  );
}
