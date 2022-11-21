import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("RequiredField Validations", () => {
  it("should return MissingParamError if field is not present", () => {
    const sut = new RequiredFieldValidation("any_field");
    const result = sut.validate({});
    expect(result).toEqual(new MissingParamError("any_field"));
  });

  it("should return nothing if field is present", () => {
    const sut = new RequiredFieldValidation("any_field");
    const result = sut.validate({ any_field: "any_value" });
    expect(result).toBeUndefined();
  });
});
