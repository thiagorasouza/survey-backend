import { makeAddSurveyValidation } from "../../../../src/main/factories/controllers";
import { Validation } from "../../../../src/presentation/protocols";
import {
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../src/validation/validators";

jest.mock("../../../../src/validation/validators/validation-composite");

describe("AddSurveyValidation Factory", () => {
  it("should call validation composite with all validations", () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    for (const field of ["question", "answers"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
