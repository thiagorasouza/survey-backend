import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
  it("should call Encrypter with correct password", () => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve("hashed_password");
      }
    }

    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledTimes(1);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
