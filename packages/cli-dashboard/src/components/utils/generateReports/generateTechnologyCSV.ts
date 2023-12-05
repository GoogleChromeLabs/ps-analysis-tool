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
 * External dependencies
 */
import { sanitizeCsvRecord } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import type { CompleteJson } from '../../../types';

const TECHNOLOGIES_DATA_HEADER = [
  'Name',
  'Description',
  'Confidence',
  'Website',
  'Categories',
];

const generateTechnologyCSV = (siteAnalysisData: CompleteJson): string => {
  const technologyDataArray = siteAnalysisData.technologyData;

  let technologyRecords = '';

  for (const technologyData of technologyDataArray) {
    //This should be in the same order as technologyDataHeader

    const categoryRecord = technologyData.categories.reduce(
      (acc, { name }) => (acc += `${name}|`),
      ''
    );

    const recordsArray = [
      technologyData.name,
      technologyData.description,
      technologyData.confidence + '%',
      technologyData.website,
      categoryRecord.slice(0, -1),
    ].map(sanitizeCsvRecord);

    technologyRecords += recordsArray.join(',') + '\r\n';
  }

  return TECHNOLOGIES_DATA_HEADER.join(',') + '\r\n' + technologyRecords;
};

export default generateTechnologyCSV;
