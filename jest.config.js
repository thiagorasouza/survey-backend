/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  coveragePathIgnorePatterns: ["<rootDir>/tests", "<rootDir>/src/main"],
};
