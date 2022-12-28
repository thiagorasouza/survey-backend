import { adaptResolver } from "../../adapters/apollo-resolver-adapter";
import { makeLoadSurveysController } from "../../factories/controllers";

export default {
  Query: {
    surveys: async () => adaptResolver(makeLoadSurveysController()),
  },
};
