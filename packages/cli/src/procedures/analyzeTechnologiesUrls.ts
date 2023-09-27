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
import { TechnologyDetailList } from '../types';
import TechnologiesManagement from '../utils/technologiesManagment';
import Utility from '../utils/utility';
import ora from 'ora';

/**
 *
 * @param urls
 */
export async function analyzeTechnologiesUrls(
  urls: Array<string>
): Promise<TechnologyDetailList> {
  const techSpinner = ora('Analyzing technologies used on the page...').start();

  const technologiesInstance = new TechnologiesManagement();
  technologiesInstance.createMultiple(urls);
  await technologiesInstance.run();

  let allTechnologies = Utility.listPluck(
    technologiesInstance.getJobs(),
    'response'
  );
  allTechnologies = Utility.mergeAll(allTechnologies);
  techSpinner.succeed('Done analyzing technologies!');

  return allTechnologies;
}
