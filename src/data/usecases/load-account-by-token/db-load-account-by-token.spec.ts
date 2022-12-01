import { Decrypter } from "../../protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DbLoadAccountByToken } from "./db-load-account-by-token";

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<string> {
      return "any_value";
    }
  }

  return new DecrypterStub();
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

describe("DbLoadAccountByToken Usecase", () => {
  it("should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");

    await sut.load("any_token", "any_role");

    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  it("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.load("any_token", "any_role");

    expect(httpResponse).toBe(null);
  });

  it("should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      "loadByToken"
    );

    await sut.load("any_token", "any_role");

    expect(loadByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  it("should return null if LoadAccountByTokenRepository returns null", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.load("any_token", "any_role");

    expect(httpResponse).toBe(null);
  });

  it("should return an account on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.load("any_token", "any_role");

    expect(httpResponse).toEqual(makeFakeAccount());
  });

  it("should throw if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load("any_token", "any_role");

    expect(promise).rejects.toThrow();
  });

  it("should throw if LoadAccountByTokenRepository throws", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load("any_token", "any_role");

    expect(promise).rejects.toThrow();
  });
});