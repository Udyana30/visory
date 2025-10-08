export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(@babel|@testing-library)/)",
    ],
  };
  