import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols";
import { Validation } from "../../protocols/validation";

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: unknown): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(input[this.fieldName]);
    }
  }
}
