import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
};

describe("Validation Composite", () => {
  it("should return an error if any validation fails ", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ other_field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return the first validation for multiple failures ", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new InvalidParamError("field"));
    const error = sut.validate({ other_field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return nothing if validation succeeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({ other_field: "any_value" });
    expect(error).toBeFalsy();
  });
});
