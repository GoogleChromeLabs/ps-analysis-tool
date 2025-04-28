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

const path = require('path');
const fs = require('fs-extra');

const MDL_URL =
  'https://raw.githubusercontent.com/GoogleChrome/ip-protection/refs/heads/main/Masked-Domain-List.md';
const target = path.resolve(__dirname, '..', 'data', 'mdl.json');

const main = async () => {
  try {
    const data = await fetch(MDL_URL);

    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
    }

    const text = await data.text();

    const lines = text
      .split('\n')
      .filter((line) => line.includes('|'))
      .slice(2);

    const mdlData = lines.map((line) =>
      line.split('|').map((item) => item.trim())
    );

    fs.writeFileSync(target, JSON.stringify(mdlData, null, 2));

    // eslint-disable-next-line no-console
    console.log('MDL updated successfully!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error fetching MDL:', error);
    process.exit(1);
  }
};

main();
