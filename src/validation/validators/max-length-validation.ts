import { InvalidParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols";

export class MaxLengthValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly maxLength: number
  ) {}

  validate(input: unknown): Error {
    if (input[this.fieldName].length > this.maxLength) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
