/** @type {import('jest').Config} */
// TODO - stop collecting coverage from MAIN and TEST folder
module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
};
