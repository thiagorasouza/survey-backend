import { LogErrorRepository } from "../../../src/data/protocols/db/log/log-error-repository";

export const mockLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(): Promise<void> {
      return null;
    }
  }

  return new LogErrorRepositoryStub();
};
