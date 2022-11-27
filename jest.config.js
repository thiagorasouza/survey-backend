/** @type {import('jest').Config} */
// TODO - stop collecting coverage from MAIN
module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
};
