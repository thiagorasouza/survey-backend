import { InvalidParamError } from "../../errors";
import { Validation } from "./validation";

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string;
  private readonly fieldToCompare: string;

  constructor(fieldName: string, fieldToCompare: string) {
    this.fieldName = fieldName;
    this.fieldToCompare = fieldToCompare;
  }

  validate(input: unknown): Error {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare);
    }
  }
}
