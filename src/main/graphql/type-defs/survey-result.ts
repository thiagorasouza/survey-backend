export default `#graphql
  extend type Query {
    surveyResult (surveyId: String!): SurveyCompiled!
  }

  extend type Mutation {
    saveSurveyResult (surveyId: String!, answer: String!): SurveyCompiled!
  }
   
  type SurveyCompiled {
    surveyId: String!
    question: String!
    answers: [SurveyCompiledAnswer]!
    didAnswer: Boolean!
    date: DateTime!
  }

  type SurveyCompiledAnswer {
    image: String
    answer: String!
    count: Int!
    percent: Float!
    isCurrentAccountAnswer: Boolean!
  }
`;
