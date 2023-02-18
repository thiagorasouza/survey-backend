import { InvalidParamError } from "../../../src/presentation/errors";
import { PatternValidation } from "../../../src/validation/validators/pattern-validation";

const fieldName = "field";
const pattern = /$[a-z]+^/i;
const validValue = "abc";
const invalidValue = "abc1";

const makeSut = (): PatternValidation =>
  new PatternValidation(fieldName, pattern);

describe("Pattern Validation", () => {
  it("should return InvalidParamError if field doesn't match the pattern", () => {
    const sut = makeSut();
    const result = sut.validate({
      [fieldName]: invalidValue,
    });
    expect(result).toEqual(new InvalidParamError("field"));
  });

  // it("should return nothing if field is equal to the minimum length", () => {
  //   const sut = makeSut();
  //   const result = sut.validate({
  //     [fieldName]: "X".repeat(minLength),
  //   });
  //   expect(result).toBeUndefined();
  // });

  // it("should return nothing if field is bigger than the minimum length", () => {
  //   const sut = makeSut();
  //   const result = sut.validate({
  //     [fieldName]: "X".repeat(minLength + 1),
  //   });
  //   expect(result).toBeUndefined();
  // });
});
