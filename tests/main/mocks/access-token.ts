import { sign } from "jsonwebtoken";
import { MongoHelper } from "../../../src/infra/db/mongodb";
import env from "../../../src/main/config/env";

export const makeAccessToken = async (role = null): Promise<string> => {
  const accounts = await MongoHelper.getCollection("accounts");
  await accounts.deleteMany({});

  const response = await accounts.insertOne({
    name: "valid_name",
    email: "valid_email@email.com",
    password: "valid_password",
    role,
  });
  const { insertedId } = response;
  const id = insertedId.toString();

  const accessToken = sign(id, env.jwtSecret);

  await accounts.updateOne(
    { _id: insertedId },
    {
      $set: {
        accessToken,
      },
    }
  );

  return accessToken;
};
