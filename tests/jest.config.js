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
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  rootDir: '../',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.svg': join(__dirname, '/svgMock.js'),
    '\\.css': join(__dirname, '/styleMock.js'),
    '\\.png': join(__dirname, '/imageMock.js'),
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.{js,jsx,ts,tsx}'],
  globals: {},
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup'],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/dist',
    '<rootDir>/out',
    '<rootDir>/node_modules',
    '<rootDir>/tests',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/third_party',
    '<rootDir>/data',
    '/stories/',
    '<rootDir>/packages/extension/src/view/devtools/index.tsx',
    '<rootDir>/packages/extension/src/view/popup/index.tsx',
  ],
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    '<rootDir>/packages/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/packages/**/stories/*.{js,jsx,ts,tsx}',
  ],
};
