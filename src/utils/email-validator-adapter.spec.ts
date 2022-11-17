import { EmailValidatorAdapter } from "./email-validator";
import validator from "validator";

describe("EmailValidator Adapter", () => {
  it("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });

  it("should return true if validator returns true", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(true);
    const isValid = sut.isValid("valid_email@mail.com");
    expect(isValid).toBe(true);
  });

  it("should call Validator with correct value", () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid("valid_email@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("valid_email@mail.com");
  });
});
