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
import '@testing-library/jest-dom';
/**
 * Internal dependencies.
 */
import { OVERLAY_CLASS, TOOLTIP_CLASS } from '../../constants';
import removeAllPopovers from '../removeAllPopovers';

describe('removeAllPopovers', () => {
  it('should remove all the popovers', () => {
    const parentDiv = document.createElement('div');
    const divEleArr = [];

    for (let i = 0; i < 6; i++) {
      const divEle = document.createElement('div');
      divEleArr.push(divEle);
    }

    divEleArr.slice(0, 4).forEach((div) => {
      div.classList.add(OVERLAY_CLASS);
      parentDiv.appendChild(div);
    });

    divEleArr.slice(4, 6).forEach((div) => {
      div.classList.add(TOOLTIP_CLASS);
      parentDiv.appendChild(div);
    });

    document.body.appendChild(parentDiv);

    // Get initial popovers count.
    const overlaysBeforeRemoval = document.querySelectorAll(
      `.${OVERLAY_CLASS}`
    ).length;
    const tooltipsBeforeRemoval = document.querySelectorAll(
      `.${TOOLTIP_CLASS}`
    ).length;

    // Call the function to remove all popovers.
    removeAllPopovers();

    // Get popovers count after removing them.
    const overlaysAfterRemoval = document.querySelectorAll(
      `.${OVERLAY_CLASS}`
    ).length;
    const tooltipsAfterRemoval = document.querySelectorAll(
      `.${TOOLTIP_CLASS}`
    ).length;

    expect(overlaysBeforeRemoval).toEqual(4);
    expect(tooltipsBeforeRemoval).toEqual(2);

    expect(overlaysAfterRemoval).toEqual(0);
    expect(tooltipsAfterRemoval).toEqual(0);
  });
});
