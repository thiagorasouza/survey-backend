import { Validation } from "../protocols";

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): null | Error {
      return null;
    }
  }

  return new ValidationStub();
};
