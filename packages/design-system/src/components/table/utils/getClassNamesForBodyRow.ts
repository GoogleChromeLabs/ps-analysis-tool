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
 *
 * @param isBlocked {boolean} The boolean value if cookie is blocked.
 * @param isHighlighted {boolean} The boolean value if row has to be highlighted.
 * @param isRowFocused {boolean} The boolean value if row is focused.
 * @param isCookieSelected {boolean} The boolean value if row is selected.
 * @param index {number} The index of the current row.
 * @returns {string} The classname has to be added to the row.
 */
export default function getClassNamesForBodyRow(
  isBlocked: boolean,
  isHighlighted: boolean | undefined,
  isRowFocused: boolean,
  isCookieSelected: boolean,
  index: number
): string {
  if (isBlocked) {
    if (isCookieSelected) {
      if (isRowFocused) {
        if (isHighlighted) {
          return 'bg-dirty-pink';
        } else {
          return 'bg-gainsboro dark:bg-outer-space';
        }
      } else {
        if (isHighlighted) {
          return 'bg-dirty-pink';
        } else {
          return 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver';
        }
      }
    } else {
      if (index % 2) {
        if (isHighlighted) {
          return 'bg-dirty-pink';
        } else {
          return 'dark:bg-flagged-row-even-dark bg-flagged-row-even-light';
        }
      } else {
        if (isHighlighted) {
          return 'bg-dirty-pink text-dirty-red dark:text-dirty-red text-dirty-red';
        } else {
          return 'dark:bg-flagged-row-odd-dark bg-flagged-row-odd-light';
        }
      }
    }
  } else {
    if (isCookieSelected) {
      if (isRowFocused) {
        if (isHighlighted) {
          return 'bg-dirty-pink text-dirty-red dark:bg-dirty-red text-dirty-red';
        } else {
          return 'bg-gainsboro dark:bg-outer-space';
        }
      } else {
        if (isHighlighted) {
          return 'bg-dirty-pink text-dirty-red dark:bg-dirty-red text-dirty-red';
        } else {
          return 'bg-gainsboro dark:bg-outer-space';
        }
      }
    } else {
      if (index % 2) {
        if (isHighlighted) {
          return 'bg-dirty-pink';
        } else {
          return 'bg-anti-flash-white dark:bg-charleston-green';
        }
      } else {
        if (isHighlighted) {
          return 'bg-dirty-pink text-dirty-red dark:bg-dirty-red text-dirty-red';
        } else {
          return 'bg-white dark:bg-raisin-black';
        }
      }
    }
  }
}
