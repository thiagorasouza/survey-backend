import jwt from "jsonwebtoken";
import { Decrypter } from "../../../data/protocols/criptography/decrypter";
import { Encrypter } from "../../../data/protocols/criptography/encrypter";

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return await jwt.sign({ id: value }, this.secret);
  }

  async decrypt(value: string): Promise<string> {
    await jwt.verify(value, this.secret);
    return;
  }
}
