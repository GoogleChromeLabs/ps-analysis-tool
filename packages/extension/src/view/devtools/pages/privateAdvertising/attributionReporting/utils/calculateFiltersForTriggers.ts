/*
 * Copyright 2025 Google LLC
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
import type { TriggerRegistration } from '@google-psat/common';

type TriggerKeys = keyof TriggerRegistration;
/**
 * This calculates the filter data for the given key
 * @param {TriggerRegistration[]} triggerRegistration The trigger registration from which key has to be calculated
 * @param {string} key The key to calculate the filter data for
 * @returns The filter values.
 */
const calculateFiltersForTrigger = (
  triggerRegistration: TriggerRegistration[],
  key: TriggerKeys
) => {
  const filters: { [key: string]: Record<'selected', boolean> } = {};
  triggerRegistration.forEach((trigger) => {
    if (key === 'destination') {
      if (!trigger[key]) {
        return;
      }

      filters[trigger[key]] = {
        selected: false,
      };
    } else {
      const _key = trigger[key] as TriggerKeys;
      filters[_key] = {
        selected: false,
      };
    }
  });
  return filters;
};

export default calculateFiltersForTrigger;
