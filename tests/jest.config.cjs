/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
const { join } = require('path');

/** @type {import('jest').Config} */
module.exports = {
  rootDir: '../',
  transformIgnorePatterns: ['node_modules/(?!(p-queue|p-timeout))'],
  moduleNameMapper: {
    '^@ps-analysis-tool\\/(.*)': '<rootDir>/packages/$1/src/',
    '\\.svg': join(__dirname, '/svgMock.cjs'),
    '\\.css': join(__dirname, '/styleMock.cjs'),
    '\\.png': join(__dirname, '/imageMock.cjs'),
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.{js,jsx,ts,tsx}'],
  globals: {},
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.cjs'],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/dist',
    '<rootDir>/out',
    '<rootDir>/node_modules',
    '<rootDir>/tests',
    '.mock.ts',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/assets',
    '<rootDir>/data',
    '/stories/',
    '<rootDir>/packages/extension/src/view/devtools/index.tsx',
    '<rootDir>/packages/extension/src/view/popup/index.tsx',
    '<rootDir>/packages/extension/src/view/devtools/devtools.ts',
  ],
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    '<rootDir>/packages/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/packages/**/stories/*.{js,jsx,ts,tsx}',
  ],
};
