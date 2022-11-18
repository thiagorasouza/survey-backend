module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
};
