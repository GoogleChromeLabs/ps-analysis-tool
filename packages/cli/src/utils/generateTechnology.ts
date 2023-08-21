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
//@ts-ignore package does not support typescript
import Wapplalyzer from 'wappalyzer';

const generateTechnology = async (url: string): Promise<{ name: string }[]> => {
  const wappalyzer = new Wapplalyzer();
  await wappalyzer.init();
  const site = await wappalyzer.open(url);
  const results = await site.analyze();

  return results.technologies;
};

export default generateTechnology;
