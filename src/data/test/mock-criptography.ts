import { Decrypter } from "../protocols/criptography/decrypter";
import { Encrypter } from "../protocols/criptography/encrypter";
import { HashComparer } from "../protocols/criptography/hash-comparer";
import { Hasher } from "../protocols/criptography/hasher";

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<string> {
      return "any_value";
    }
  }

  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return "any_token";
    }
  }
  return new EncrypterStub();
};

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }

  return new HasherStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};
