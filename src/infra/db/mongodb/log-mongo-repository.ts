import { LogErrorRepository } from "../../../data/protocols/db/log/log-error-repository";
import { MongoHelper } from "./mongo-helper";

export class LogMongoRespository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errors = await MongoHelper.getCollection("errors");
    await errors.insertOne({ stack, date: new Date() });
    return;
  }
}
