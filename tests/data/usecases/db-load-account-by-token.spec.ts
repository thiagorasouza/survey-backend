import {
  Decrypter,
  LoadAccountByTokenRepository,
} from "../../../src/data/protocols";
import { DbLoadAccountByToken } from "../../../src/data/usecases";
import { mockAccountModel } from "../../domain/mocks";
import { mockLoadAccountByTokenRepository, mockDecrypter } from "../mocks";

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
  const decrypterStub = mockDecrypter();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

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

    expect(httpResponse).toEqual(mockAccountModel());
  });

  it("should return null if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const result = await sut.load("any_token", "any_role");

    expect(result).toBe(null);
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