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
import type { LibraryData } from '../types';

/**
 * Sums up two library detection objects.
 * @param obj1 - The first library detection object.
 * @param obj2 - The second library detection object.
 * @returns The sum of the two library detection object.
 */
const sumUpDetectionResults = (obj1: LibraryData, obj2: LibraryData) => {
  const resultObj: LibraryData = { ...obj1 };

  const libraryKeys = Object.keys(obj1);

  for (let i = 0; i < libraryKeys.length; i++) {
    const key = libraryKeys[i] as keyof LibraryData;

    const resultObjMatches = resultObj[key] ? resultObj[key].matches ?? [] : [];
    const obj2Matches = obj2[key] ? obj2[key].matches ?? [] : [];

    for (let j = 0; j < resultObjMatches.length; j++) {
      const featureText = resultObjMatches[j].feature.text;
      const sameFeatureInOtherObject = obj2Matches.find(
        (match) => match.feature.text === featureText
      );

      if (!sameFeatureInOtherObject) {
        continue;
      }

      const sameFeatureInOtherObjectIndex = obj2Matches.findIndex(
        (match) => match.feature.text === featureText
      );

      obj2Matches.splice(sameFeatureInOtherObjectIndex, 1);

      resultObjMatches[j].subItems.items = [
        ...resultObjMatches[j].subItems.items,
        ...sameFeatureInOtherObject.subItems.items,
      ];
    }

    resultObj[key].matches = [...resultObjMatches, ...obj2Matches];

    const resultObjSignature = resultObj[key]
      ? resultObj[key].signatureMatches ?? 0
      : 0;
    const obj2Signature = obj2[key] ? obj2[key].signatureMatches ?? 0 : 0;

    resultObj[key].signatureMatches = resultObjSignature + obj2Signature;

    if (resultObj[key].moduleMatch && obj2[key].moduleMatch) {
      resultObj[key].moduleMatch =
        (resultObj[key].moduleMatch as number) +
        (obj2[key].moduleMatch as number);
    }
  }

  return resultObj;
};

export default sumUpDetectionResults;
