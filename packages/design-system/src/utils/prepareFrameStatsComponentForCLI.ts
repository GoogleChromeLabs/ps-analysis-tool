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
import type { CompleteJson } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import { EMPTY_FRAME_COUNT, EMPTY_FRAME_LEGEND } from '../constants';

/**
 * Calcualte insights about frames to be shown on cookies landing page.
 * @param json Complete json for the Dashboard.
 * @returns object
 */
export default function prepareFrameStatsComponentForCLI(
  json: CompleteJson | null
) {
  if (!json) {
    return {
      dataMapping: EMPTY_FRAME_COUNT,
      legend: EMPTY_FRAME_LEGEND,
    };
  }

  const blockedCookieFrame = new Set();
  const unBlockedCookieFrame = new Set();
  const cookieFrame = new Set();

  Object.keys(json.cookieData || {}).forEach((frame) => {
    let hasBlockedCookie = false;
    let hasUnblockedCookie = false;

    if (Object.keys(json.cookieData[frame].frameCookies).length > 0) {
      cookieFrame.add(frame);
      Object.keys(json.cookieData[frame].frameCookies).forEach((cookieKey) => {
        const cookie = json.cookieData[frame].frameCookies[cookieKey];
        if (cookie?.blockedReasons && cookie?.blockedReasons?.length > 0) {
          hasBlockedCookie = true;
        }
        if (cookie.blockedReasons?.length === 0) {
          hasUnblockedCookie = true;
        }
      });
      if (hasBlockedCookie) {
        blockedCookieFrame.add(frame);
      }

      if (hasUnblockedCookie) {
        unBlockedCookieFrame.add(frame);
      }
    }
  });

  return {
    dataMapping: [
      {
        title: I18n.getMessage('frames'),
        count: Object.keys(json.cookieData || {}).length,
        data: [
          {
            count: Object.keys(json.cookieData || {}).length,
            color: '#25ACAD',
          },
          {
            count: unBlockedCookieFrame.size,
            color: '#F54021',
          },
          {
            count: blockedCookieFrame.size,
            color: '#AF7AA3',
          },
          {
            count: cookieFrame.size,
            color: '#C5A06A',
          },
          {
            count: Object.values(json.cookieData || {}).filter(
              (frame) => frame?.frameType === 'fenced_frame'
            ).length,
            color: '#A98307',
          },
        ],
      },
    ],
    legend: [
      {
        label: I18n.getMessage('totalFrames'),
        descriptionKey: 'Total frames',
        count: Object.keys(json.cookieData || {}).length,
        color: '#25ACAD',
        countClassName: 'text-greenland-green',
      },
      {
        label: I18n.getMessage('framesWithCookies'),
        descriptionKey: 'Frames with cookies',
        count: cookieFrame.size,
        color: '#C5A06A',
        countClassName: 'text-good-life',
      },
      {
        label: I18n.getMessage('framesWithBlockedCookies'),
        descriptionKey: 'Frames with blocked cookies',
        count: blockedCookieFrame.size,
        color: '#AF7AA3',
        countClassName: 'text-victorian-violet',
      },
      {
        label: I18n.getMessage('framesWithUnblockedCookies'),
        descriptionKey: 'Frames with unblocked cookies',
        count: unBlockedCookieFrame.size,
        color: '#F54021',
        countClassName: 'text-strawberry-spinach-red',
      },
      {
        label: I18n.getMessage('fencedFrames'),
        descriptionKey: 'Fenced frames',
        count: Object.values(json.cookieData || {}).filter(
          (frame) => frame?.frameType === 'fenced_frame'
        ).length,
        color: '#A98307',
        countClassName: 'text-chestnut-gold',
      },
    ],
  };
}
