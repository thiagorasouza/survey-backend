import { adaptResolver } from "../../adapters/apollo-resolver-adapter";
import {
  makeLoadSurveyResultController,
  makeSaveSurveyResultController,
} from "../../factories/controllers";
import { throwIfNotAuthenticated } from "../helpers/throw-if-not-authenticated";

export default {
  Query: {
    surveyResult: async (
      parent: any,
      args: any,
      contextValue: any
    ): Promise<void> => {
      throwIfNotAuthenticated(contextValue);
      return adaptResolver(makeLoadSurveyResultController(), args);
    },
  },
  Mutation: {
    saveSurveyResult: async (
      parent: any,
      args: any,
      contextValue: any
    ): Promise<void> => {
      throwIfNotAuthenticated(contextValue);
      return adaptResolver(makeSaveSurveyResultController(), args);
    },
  },
};
