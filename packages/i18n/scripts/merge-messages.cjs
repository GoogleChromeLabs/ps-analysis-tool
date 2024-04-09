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
const fs = require('fs');

const PACKAGES = [
  'cli',
  'cli-dashboard',
  'common',
  'design-system',
  'extension',
];
const COMMON_PATH = 'packages/i18n/_locales';
const TARGET = `${COMMON_PATH}/messages/en/messages.json`;

const main = () => {
  fs.writeFileSync(TARGET, '{}');

  const messages = {};

  PACKAGES.forEach((pkg) => {
    const path = `${COMMON_PATH}/packages/${pkg}/messages.json`;
    const data = fs.readFileSync(path, 'utf8') || '{}';
    const parsed = JSON.parse(data);

    Object.entries(parsed).forEach(([key, value]) => {
      if (messages[key]) {
        throw new Error(
          `Duplicate key: ${key}, found in ${pkg}. Please resolve this conflict before continuing.`
        );
      }

      messages[key] = value;
    });
  });

  fs.writeFileSync(TARGET, JSON.stringify(messages, null, 2));
};

main();
