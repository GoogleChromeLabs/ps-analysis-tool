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

  const libraryKeys = Object.keys(obj1);

  for (let i = 0; i < libraryKeys.length; i++) {
    const key = libraryKeys[i] as keyof LibraryData;
    for (let j = 0; j < resultObj[key].matches.length; j++) {
      // Add Matches array
      const featureText = resultObj[key].matches[j].feature.text;
      const sameFeatureInOtherObject = obj2[key].matches.find(
        (match) => match.feature.text === featureText
      );

      if (!sameFeatureInOtherObject) {
        continue;
      }

      const sameFeatureInOtherObjectIndex = obj2[key].matches.findIndex(
        (match) => match.feature.text === featureText
      );

      obj2[key].matches.splice(sameFeatureInOtherObjectIndex, 1);

      resultObj[key].matches[j].subItems.items = [
        ...resultObj[key].matches[j].subItems.items,
        ...sameFeatureInOtherObject.subItems.items,
      ];
    }

    resultObj[key].matches = [...resultObj[key].matches, ...obj2[key].matches];

    resultObj[key].signatureMatches =
      resultObj[key].signatureMatches + obj2[key].signatureMatches;

    if (resultObj[key].moduleMatch && obj2[key].moduleMatch) {
      resultObj[key].moduleMatch =
        (resultObj[key].moduleMatch as number) +
        (obj2[key].moduleMatch as number);
    }
  }

  return resultObj;
};

export default sumUpDetectionResults;
