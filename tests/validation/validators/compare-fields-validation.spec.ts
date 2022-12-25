import { InvalidParamError } from "../../../src/presentation/errors";
import { CompareFieldsValidation } from "../../../src/validation/validators/compare-fields-validation";

const makeSut = (): CompareFieldsValidation =>
  new CompareFieldsValidation("field", "field_confirmation");

describe("CoompareFields Validations", () => {
  it("should return InvalidParamError if fields are different", () => {
    const sut = makeSut();
    const result = sut.validate({
      field: "any_value",
      field_confirmation: "other_value",
    });
    expect(result).toEqual(new InvalidParamError("field_confirmation"));
  });

  it("should return nothing if fields are identical", () => {
    const sut = makeSut();
    const result = sut.validate({
      field: "any_value",
      field_confirmation: "any_value",
    });
    expect(result).toBeUndefined();
  });
});
