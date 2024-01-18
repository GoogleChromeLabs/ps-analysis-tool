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
import { LibraryData } from '../../types';

/**
 * Util function that sums up two GSIv2 detection representational objects, LibraryData
 * @param {any} obj1:LibraryData
 * @param {any} obj2:LibraryData
 * @param obj1
 * @param obj2
 * @returns {any}
 */
const sumUpGSIv2Matches = (obj1: LibraryData, obj2: LibraryData) => {
  const resultObj: LibraryData = { ...obj1 };

  for (let i = 0; i < resultObj.gsiV2.matches.length; i++) {
    // Add Matches array
    const featureText = resultObj.gsiV2.matches[i].feature.text;
    const sameFeatureInOtherObject = obj2.gsiV2.matches.find(
      (match) => match.feature.text === featureText
    );

    if (!sameFeatureInOtherObject) {
      continue;
    }

    const sameFeatureInOtherObjectIndex = obj2.gsiV2.matches.findIndex(
      (match) => match.feature.text === featureText
    );

    obj2.gsiV2.matches.splice(sameFeatureInOtherObjectIndex, 1);

    resultObj.gsiV2.matches[i].subItems.items = [
      ...resultObj.gsiV2.matches[i].subItems.items,
      ...sameFeatureInOtherObject.subItems.items,
    ];
  }

  resultObj.gsiV2.matches = [...resultObj.gsiV2.matches, ...obj2.gsiV2.matches];

  resultObj.gis.signatureMatches =
    resultObj.gis.signatureMatches + obj2.gis.signatureMatches;

  resultObj.gsiV2.signatureMatches =
    resultObj.gsiV2.signatureMatches + obj2.gsiV2.signatureMatches;

  resultObj.gsiV2.moduleMatch =
    resultObj.gsiV2.moduleMatch + obj2.gsiV2.moduleMatch;

  return resultObj.gsiV2;
};

export default sumUpGSIv2Matches;
