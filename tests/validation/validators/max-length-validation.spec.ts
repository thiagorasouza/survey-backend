import { InvalidParamError } from "../../../src/presentation/errors";
import { MaxLengthValidation } from "../../../src/validation/validators/max-length-validation";

const fieldName = "field";
const maxLength = 8;

const makeSut = (): MaxLengthValidation =>
  new MaxLengthValidation(fieldName, maxLength);

describe("MaxLength Validations", () => {
  it("should return InvalidParamError if field length is bigger than max length", () => {
    const sut = makeSut();
    const result = sut.validate({
      [fieldName]: "X".repeat(maxLength + 1),
    });
    expect(result).toEqual(new InvalidParamError("field"));
  });

  it("should return nothing if field is equal to the max length", () => {
    const sut = makeSut();
    const result = sut.validate({
      [fieldName]: "X".repeat(maxLength),
    });
    expect(result).toBeUndefined();
  });

  // it("should return nothing if field is bigger than the minimum length", () => {
  //   const sut = makeSut();
  //   const result = sut.validate({
  //     [fieldName]: "X".repeat(minLength + 1),
  //   });
  //   expect(result).toBeUndefined();
  // });
});
