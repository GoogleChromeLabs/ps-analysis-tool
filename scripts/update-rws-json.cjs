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
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const targetDIR = path.resolve(__dirname, '..', 'data/');
const requestURL =
  'https://raw.githubusercontent.com/GoogleChrome/related-website-sets/main/related_website_sets.JSON';

const errorHandler = (err) => {
  console.error(err.message); // eslint-disable-line no-console
  process.exit(1);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addKeysToLocale = async (data) => {
  const messagesPath = path.resolve(
    'packages/i18n/_locales/messages/en/messages.json'
  );
  const messages = await fs.readJson(messagesPath);

  data.sets.forEach((set) => {
    const rationalesObj = set.rationaleBySite;
    Object.entries(rationalesObj).forEach(([site, rationale]) => {
      const key = `RWS_rationale_${site.replace(/[:/ *-.%“”()[\]]/g, '_')}`;

      messages[key] = {
        message: rationale,
        description: 'Rationale for a site in the related website set',
      };

      rationalesObj[site] = key;
    });
  });

  await fs.writeJson(messagesPath, messages, { spaces: 2 });
};

const main = async () => {
  console.log('Updating related_website_sets.json file...'); // eslint-disable-line no-console

  try {
    const response = await fetch(requestURL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Add keys, messages to _locale/en/messages.json and replace the text with keys in the formattedData
    // Not using i18n functions, so no need to add keys to locale for now.
    // await addKeysToLocale(data);

    await fs.writeFile(
      path.resolve(targetDIR, 'related_website_sets.json'),
      JSON.stringify(data, null, 2)
    );

    console.log('related_website_sets.json file updated successfully!'); // eslint-disable-line no-console
  } catch (error) {
    errorHandler(error);
  }
};

main();
