import {
  Decrypter,
  LoadAccountByTokenRepository,
} from "../../../src/data/protocols";
import { DbLoadAccountByToken } from "../../../src/data/usecases";
import { mockAccountModel } from "../../domain/mocks";
import {
  mockLoadAccountByTokenRepository,
  mockDecrypter,
  mockLoadAccountByTokenRequestModel,
} from "../mocks";

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

    const requestModel = mockLoadAccountByTokenRequestModel();
    await sut.load(requestModel);

    expect(decryptSpy).toHaveBeenCalledWith(requestModel.accessToken);
  });

  it("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(Promise.resolve(null));

    const requestModel = mockLoadAccountByTokenRequestModel();
    const httpResponse = await sut.load(requestModel);

    expect(httpResponse).toBe(null);
  });

  it("should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      "loadByToken"
    );

    const requestModel = mockLoadAccountByTokenRequestModel();
    await sut.load(requestModel);

    expect(loadByTokenSpy).toHaveBeenCalledWith(
      requestModel.accessToken,
      requestModel.role
    );
  });

  it("should return null if LoadAccountByTokenRepository returns null", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(Promise.resolve(null));

    const requestModel = mockLoadAccountByTokenRequestModel();
    const httpResponse = await sut.load(requestModel);

    expect(httpResponse).toBe(null);
  });

  it("should return null if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const requestModel = mockLoadAccountByTokenRequestModel();
    const result = await sut.load(requestModel);

    expect(result).toBe(null);
  });

  it("should throw if LoadAccountByTokenRepository throws", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const requestModel = mockLoadAccountByTokenRequestModel();
    const promise = sut.load(requestModel);

    expect(promise).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const { sut } = makeSut();

    const requestModel = mockLoadAccountByTokenRequestModel();
    const httpResponse = await sut.load(requestModel);

    expect(httpResponse).toEqual(mockAccountModel());
  });
});
