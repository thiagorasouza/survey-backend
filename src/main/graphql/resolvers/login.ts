import { adaptResolver } from "../../adapters/apollo-resolver-adapter";
import { makeLoginController } from "../../factories/controllers";

export default {
  Query: {
    login: async (parent: any, args: any) =>
      adaptResolver(makeLoginController(), args),
  },
};
