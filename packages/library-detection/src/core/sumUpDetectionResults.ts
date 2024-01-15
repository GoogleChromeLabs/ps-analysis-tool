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
import sumUpGISMatches from '../libraries/gis/sumUpGISMatches';
import sumUpGSIv2Matches from '../libraries/gsi/sumUpGSIv2Matches';

const sumUpDetectionResults = (obj1: LibraryData, obj2: LibraryData) => {
  const resultObj: LibraryData = { ...obj1 };

  resultObj.gis = sumUpGISMatches(resultObj, obj2);
  //GSI 2 matches

  resultObj.gsiV2 = sumUpGSIv2Matches(resultObj, obj2);

  return resultObj;
};

export default sumUpDetectionResults;
