import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

// jest.mock("jsonwebtoken", () => ({
//   __esModule: true,
//   ...jest.requireActual("jsonwebtoken"),
//   async sign(): Promise<string> {
//     return "any_token";
//   },
// }));

describe("JWT Adapter", () => {
  it("should call sign with correct values", async () => {
    const sut = new JwtAdapter("secret");
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });

  it("should return a token on sign success", async () => {
    const sut = new JwtAdapter("secret");
    jest.spyOn(jwt, "sign").mockImplementationOnce(async () => "any_token");
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toBe("any_token");
  });

  it("should throw if sign throws", async () => {
    const sut = new JwtAdapter("secret");
    jest.spyOn(jwt, "sign").mockImplementationOnce(async () => {
      throw new Error();
    });
    const promise = sut.encrypt("any_id");
    expect(promise).rejects.toThrow();
  });
});
