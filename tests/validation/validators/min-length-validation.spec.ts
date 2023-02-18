import { InvalidParamError } from "../../../src/presentation/errors";
import { MinLengthValidation } from "../../../src/validation/validators/min-length-validation";

const fieldName = "field";
const minLength = 6;

const makeSut = (): MinLengthValidation =>
  new MinLengthValidation(fieldName, minLength);

describe("CoompareFields Validations", () => {
  it("should return InvalidParamError if field length is smaller than minimum length", () => {
    const sut = makeSut();
    const result = sut.validate({
      [fieldName]: "X".repeat(minLength - 1),
    });
    expect(result).toEqual(new InvalidParamError("field"));
  });

  it("should return nothing if field is equal to the minimum length", () => {
    const sut = makeSut();
    const result = sut.validate({
      [fieldName]: "X".repeat(minLength),
    });
    expect(result).toBeUndefined();
  });
});
