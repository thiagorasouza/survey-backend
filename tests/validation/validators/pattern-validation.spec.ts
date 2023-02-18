import { InvalidParamError } from "../../../src/presentation/errors";
import { PatternValidation } from "../../../src/validation/validators/pattern-validation";

const fieldName = "field";
const pattern = /^[a-z]+$/i;
const invalidValue = "abc1";
const validValue = "abc";

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

  it("should return nothing if field matches the pattern", () => {
    const sut = makeSut();
    const result = sut.validate({
      [fieldName]: validValue,
    });
    expect(result).toBeUndefined();
  });
});
