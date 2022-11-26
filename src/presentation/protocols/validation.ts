export interface Validation {
  validate(input: unknown): null | Error;
}
