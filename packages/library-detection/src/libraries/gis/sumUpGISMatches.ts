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
 * Util function which sums up detection results GIS
 * @param {any} obj1:LibraryData
 * @param {any} obj2:LibraryData
 * @param obj1
 * @param obj2
 * @returns {any}
 */
const sumUpGISMatches = (obj1: LibraryData, obj2: LibraryData) => {
  const resultObj: LibraryData = { ...obj1 };

  for (let i = 0; i < resultObj.gis.matches.length; i++) {
    // Add Matches array
    const featureText = resultObj.gis.matches[i].feature.text;
    const sameFeatureInOtherObject = obj2.gis.matches.find(
      (match) => match.feature.text === featureText
    );

    if (!sameFeatureInOtherObject) {
      continue;
    }

    const sameFeatureInOtherObjectIndex = obj2.gis.matches.findIndex(
      (match) => match.feature.text === featureText
    );

    obj2.gis.matches.splice(sameFeatureInOtherObjectIndex, 1);

    resultObj.gis.matches[i].subItems.items = [
      ...resultObj.gis.matches[i].subItems.items,
      ...sameFeatureInOtherObject.subItems.items,
    ];
  }

  resultObj.gis.matches = [...resultObj.gis.matches, ...obj2.gis.matches];

  return resultObj.gis;
};

export default sumUpGISMatches;
