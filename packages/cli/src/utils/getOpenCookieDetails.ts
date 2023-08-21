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
import fs from 'fs';

const getOpenCookiesDetails = (): object => {
  const path =
    __dirname + '/../../../third_party/data/open-cookie-database.json';
  const cookiesDetails: { [key: string]: any } = JSON.parse(
    fs.readFileSync(path).toString()
  );
  const response: { [key: string]: any } = {};

  if (cookiesDetails) {
    // eslint-disable-next-line guard-for-in
    for (const key in cookiesDetails) {
      const cookiesDetailList: { [key: string]: any } =
        cookiesDetails[key as keyof object];
      response[key] = cookiesDetailList.shift();
    }
  }

  return response;
};

export default getOpenCookiesDetails;
