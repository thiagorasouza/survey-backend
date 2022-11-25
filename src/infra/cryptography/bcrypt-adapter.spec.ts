import * as bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  __esModule: true,
  ...jest.requireActual("bcrypt"),
  async hash(): Promise<string> {
    return "hashed_value";
  },

  async compare(): Promise<boolean> {
    return true;
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  it("should call hash with correct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  it("should return a valid hash on hash success", async () => {
    const sut = makeSut();
    const hash = await sut.hash("any_value");
    expect(hash).toBe("hashed_value");
  });

  it("should throw if bcrypt throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementation(async () => {
      throw new Error();
    });
    const promise = sut.hash("any_value");
    expect(promise).rejects.toThrow();
  });

  it("should call compare with correct values", async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");

    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  it("should return true when compare succeeds", async () => {
    const sut = makeSut();
    const result = await sut.compare("any_value", "any_hash");
    expect(result).toBe(true);
  });
});
