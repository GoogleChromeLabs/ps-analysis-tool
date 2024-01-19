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
 * Internal dependencies.
 */
import { LibraryData } from '../types';
import { sumUpGISMatches, sumUpGSIv2Matches } from '../libraries';

/**
 * Util function for adding up LibraryData Objects
 * @param {any} obj1:LibraryData
 * @param {any} obj2:LibraryData
 * @param obj1
 * @param obj2
 * @returns {any}
 */
const sumUpDetectionResults = (obj1: LibraryData, obj2: LibraryData) => {
  const resultObj: LibraryData = { ...obj1 };

  resultObj.gis = sumUpGISMatches(resultObj, obj2);

  resultObj.gsiV2 = sumUpGSIv2Matches(resultObj, obj2);

  return resultObj;
};

export default sumUpDetectionResults;
