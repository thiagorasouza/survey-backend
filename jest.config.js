/* eslint-disable @typescript-eslint/no-var-requires */
// /** @type {import('ts-jest').JestConfigWithTsJest} */
const tsJestPreset = require("ts-jest/jest-preset");
const jestMongoDbPreset = require("@shelf/jest-mongodb/jest-preset");

module.exports = {
  ...tsJestPreset,
  ...jestMongoDbPreset,
  testEnvironment: "node",
};
