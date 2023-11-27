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
import addTooltip from '../addTooltip';
import setTooltipPosition from '../setTooltipPosition';

describe('setTooltipPosition', () => {
  beforeAll(() => {
    globalThis.HTMLElement.prototype.showPopover = () => {
      // Do nothing.
    };
  });

  it('should set tooltip postion for hidden frame', () => {
    const response = {
      selectedFrame: 'http://example.com',
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.example.com/');

    const isHiddenFrame = true;
    const tooltip = addTooltip(iframe, response, 0, 0);

    // Set tooltip position.
    setTooltipPosition(tooltip, iframe, isHiddenFrame, response.selectedFrame);

    expect(tooltip).not.toEqual(null);
    expect(tooltip?.classList.contains('ps-fixed')).toEqual(true);
    expect(tooltip?.classList.contains('ps-tooltip')).toEqual(true);
    expect(tooltip?.style.top).toEqual('0px');
    expect(tooltip?.style.right).toEqual('30px');
    expect(
      tooltip?.firstElementChild?.classList.contains(
        'ps-tooltip-top-left-notch'
      )
    ).toEqual(true);
  });

  it('should set tooltip postion for visible frame', () => {
    const response = {
      selectedFrame: 'http://example.com',
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.example.com/');
    iframe.setAttribute('width', '300px');
    iframe.setAttribute('height', '200px');

    const isHiddenFrame = false;
    const tooltip = addTooltip(iframe, response, 0, 0);

    // Set tooltip position.
    setTooltipPosition(tooltip, iframe, isHiddenFrame, response.selectedFrame);

    expect(tooltip).not.toEqual(null);
    expect(tooltip?.classList.contains('ps-fixed')).toEqual(false);
    expect(tooltip?.classList.contains('ps-tooltip')).toEqual(true);
    expect(tooltip?.style.top).toEqual('0px');
    expect(tooltip?.style.left).toEqual('0px');
    expect(
      tooltip?.firstElementChild?.classList.contains('ps-tooltip-top-notch')
    ).toEqual(false);
  });

  it('should set tooltip postion for visible frame with selected frame as origin', () => {
    const response = {
      selectedFrame: 'http://example.com',
      isInspecting: true,
    };
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'http://localhost');
    iframe.setAttribute('width', '300px');
    iframe.setAttribute('height', '200px');

    const isHiddenFrame = false;
    const tooltip = addTooltip(iframe, response, 0, 0);

    // Set tooltip position.
    setTooltipPosition(tooltip, iframe, isHiddenFrame, 'http://localhost');

    expect(tooltip).not.toEqual(null);
    expect(tooltip?.classList.contains('ps-fixed')).toEqual(true);
    expect(tooltip?.classList.contains('ps-tooltip')).toEqual(true);
    expect(tooltip?.style.top).toEqual('5px');
    expect(tooltip?.style.left).toEqual('0px');
    expect(
      tooltip?.firstElementChild?.classList.contains(
        'ps-tooltip-top-left-notch'
      )
    ).toEqual(true);
  });
});
