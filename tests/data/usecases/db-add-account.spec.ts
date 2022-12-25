import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "../../../src/data/protocols";
import { DbAddAccount } from "../../../src/data/usecases";
import { mockAddAccountParams, mockAccountModel } from "../../domain/mocks";
import {
  mockAddAccountRepository,
  mockHasher,
  mockLoadAccountByEmailRepository,
} from "../mocks";

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = mockAddAccountRepository();
  const hasherStub = mockHasher();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  jest
    .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
    .mockReturnValue(null);
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAddAccount", () => {
  it("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(mockAddAccountParams());
    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should return null if LoadAccountByEmailRepository does not return null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(Promise.resolve(mockAccountModel()));
    const result = await sut.add(mockAddAccountParams());
    expect(result).toBe(null);
  });

  it("should throw if LoadAccountByEmailRepository throws", () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const accountData = mockAddAccountParams();
    expect(sut.add(accountData)).rejects.toThrow();
  });

  it("should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    const accountData = mockAddAccountParams();
    await sut.add(accountData);
    expect(hasherSpy).toHaveBeenCalledTimes(1);
    expect(hasherSpy).toHaveBeenCalledWith("any_password");
  });

  it("should throw if Hasher throws", () => {
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, "hash")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const accountData = mockAddAccountParams();
    expect(sut.add(accountData)).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = mockAddAccountParams();
    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "hashed_password",
    });
  });

  it("should throw if AddAccountRepository throws", () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const accountData = mockAddAccountParams();
    expect(sut.add(accountData)).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = mockAddAccountParams();
    const account = await sut.add(accountData);

    expect(account).toEqual(mockAccountModel());
  });

  it("should return the new account on success", async () => {
    const { sut } = makeSut();
    const accountData = mockAddAccountParams();
    const account = await sut.add(accountData);
    expect(account).toEqual(mockAccountModel());
  });
});