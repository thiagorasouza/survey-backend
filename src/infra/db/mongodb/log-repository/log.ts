import { LogErrorRepository } from "../../../../data/protocols/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class LogMongoRespository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errors = await MongoHelper.getCollection("errors");
    await errors.insertOne({ stack, date: new Date() });
    return;
  }
}
