import { adaptResolver } from "../../adapters/apollo-resolver-adapter";
import {
  makeLoginController,
  makeSignUpController,
} from "../../factories/controllers";

export default {
  Query: {
    login: async (parent: any, args: any) =>
      adaptResolver(makeLoginController(), args),
  },
  Mutation: {
    signup: async (parent: any, args: any) =>
      adaptResolver(makeSignUpController(), args),
  },
};
