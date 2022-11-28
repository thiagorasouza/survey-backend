import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

const makeSut = (): JwtAdapter => new JwtAdapter("secret");

describe("JWT Adapter Encrypter", () => {
  describe("Encrypter", () => {
    it("should call sign with correct values", async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, "sign");
      await sut.encrypt("any_id");
      expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
    });

    it("should return a token on sign success", async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "sign").mockImplementationOnce(async () => "any_token");
      const accessToken = await sut.encrypt("any_id");
      expect(accessToken).toBe("any_token");
    });

    it("should throw if sign throws", async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "sign").mockImplementationOnce(async () => {
        throw new Error();
      });
      const promise = sut.encrypt("any_id");
      expect(promise).rejects.toThrow();
    });
  });

  describe("Decrypter", () => {
    it("should call verify with correct values", async () => {
      const sut = makeSut();

      jest.spyOn(jwt, "verify").mockImplementationOnce(async () => "any_value");
      const verifySpy = jest.spyOn(jwt, "verify");

      await sut.decrypt("any_token");

      expect(verifySpy).toHaveBeenCalledWith("any_token", "secret");
    });

    it("should return a value on verify success", async () => {
      const sut = makeSut();

      jest.spyOn(jwt, "verify").mockImplementationOnce(async () => "any_value");

      const value = await sut.decrypt("any_token");

      expect(value).toBe("any_value");
    });

    it("should throw if verify throws", async () => {
      const sut = makeSut();

      jest.spyOn(jwt, "verify").mockImplementationOnce(async () => {
        throw new Error();
      });

      const promise = sut.decrypt("any_token");

      expect(promise).rejects.toThrow();
    });
  });
});
