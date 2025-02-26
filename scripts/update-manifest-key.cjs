/*
 * Copyright 2025 Google LLC
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
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Path to the manifest file
const manifestPath = path.join(__dirname, '../dist/extension/manifest.json');

// Key and value from .env
const newKey = 'key';
const newValue = process.env.MANIFEST_KEY_VALUE;

if (!newValue) {
  // eslint-disable-next-line no-console
  console.error('Error: MANIFEST_KEY_VALUE is not set in .env file.');
  process.exit(1);
}

try {
  const manifestData = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestData);

  manifest[newKey] = newValue;

  // Write the updated manifest back to the file
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  // eslint-disable-next-line no-console
  console.log(
    `Successfully updated manifest.json with "${newKey}": "${newValue}"`
  );
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Error updating manifest.json:', error);
  process.exit(1);
}
