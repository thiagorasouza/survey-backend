import {
  Encrypter,
  AccountModel,
  AddAccountRepository,
  AddAccountModel,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }

  return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository();
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { sut, encrypterStub, addAccountRepositoryStub };
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "hashed_password",
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

describe("DbAddAccount", () => {
  it("should call Encrypter with correct password", () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = makeFakeAccountData();
    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledTimes(1);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  it("should throw if Encrypter throws", () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const accountData = makeFakeAccountData();
    expect(sut.add(accountData)).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccountData();
    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
  });

  it("should throw if AddAccountRepository throws", () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const accountData = makeFakeAccountData();
    expect(sut.add(accountData)).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccountData();
    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });
});
