import {
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
} from "../../../src/data/protocols";
import { DbAuthentication } from "../../../src/data/usecases";
import {
  mockAuthenticationRequestModel,
  mockAuthenticationModel,
} from "../../domain/mocks";
import {
  mockUpdateAccessTokenRepository,
  mockEncrypter,
  mockHashComparer,
  mockLoadAccountByEmailRepository,
} from "../mocks";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const encrypterStub = mockEncrypter();
  const hashComparerStub = mockHashComparer();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub: encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("DbAuthentication Use Case ", () => {
  it("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");

    await sut.auth(mockAuthenticationRequestModel());

    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(mockAuthenticationRequestModel());

    await expect(promise).rejects.toThrow();
  });

  it("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.auth(mockAuthenticationRequestModel());

    expect(result).toBe(null);
  });

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    const fakeAuthentication = mockAuthenticationRequestModel();
    await sut.auth(fakeAuthentication);

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(mockAuthenticationRequestModel());

    await expect(promise).rejects.toThrow();
  });

  it("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(Promise.resolve(false));

    const result = await sut.auth(mockAuthenticationRequestModel());

    expect(result).toBe(null);
  });

  it("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();

    const generateSpy = jest.spyOn(encrypterStub, "encrypt");
    const fakeAuthentication = mockAuthenticationRequestModel();

    await sut.auth(fakeAuthentication);

    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(mockAuthenticationRequestModel());

    await expect(promise).rejects.toThrow();
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );

    const fakeAuthentication = mockAuthenticationRequestModel();
    await sut.auth(fakeAuthentication);

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(mockAuthenticationRequestModel());

    await expect(promise).rejects.toThrow();
  });

  it("should return token and name on success", async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(mockAuthenticationRequestModel());

    await expect(accessToken).toEqual(mockAuthenticationModel());
  });
});
