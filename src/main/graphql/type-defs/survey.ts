export default `#graphql
  extend type Query {
    surveys: [Survey!]!
  }
   
  type Survey {
    id: ID!
    question: String!
    answers: [Answer!]!
    date: DateTime!
    didAnswer: Boolean
  }

  type Answer {
    image: String
    answer: String!
  }
`;
