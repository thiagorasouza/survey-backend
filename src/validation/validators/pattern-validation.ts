import { InvalidParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols";

export class PatternValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly pattern: RegExp
  ) {}

  validate(input: unknown): Error {
    const patternMatches = this.pattern.test(input[this.fieldName]);
    if (!patternMatches) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
