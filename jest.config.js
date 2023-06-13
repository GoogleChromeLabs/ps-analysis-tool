export default {
  rootDir: './',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testMatch: [ '**/tests/**/*.{js,jsx,ts,tsx}' ],
  globals: {},
  setupFilesAfterEnv: [ '<rootDir>/jest.setup' ],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/dist',
    '<rootDir>/out',
    '<rootDir>/node_modules',
  ],
};
