import { InvalidParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols";

export class MinLengthValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly minLength: number
  ) {}

  validate(input: unknown): Error {
    if (input[this.fieldName].length < this.minLength) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
