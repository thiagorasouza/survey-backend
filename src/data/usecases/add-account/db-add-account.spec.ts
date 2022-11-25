import {
  Hasher,
  AccountModel,
  AddAccountRepository,
  AddAccountModel,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }

  return new HasherStub();
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
  const hasherStub = makeHasherStub();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return { sut, hasherStub, addAccountRepositoryStub };
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
  it("should call Hasher with correct password", () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    const accountData = makeFakeAccountData();
    sut.add(accountData);
    expect(hasherSpy).toHaveBeenCalledTimes(1);
    expect(hasherSpy).toHaveBeenCalledWith("valid_password");
  });

  it("should throw if Hasher throws", () => {
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, "hash")
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
