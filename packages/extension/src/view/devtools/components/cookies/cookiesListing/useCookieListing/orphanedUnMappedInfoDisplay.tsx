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
 * External dependencies.
 */
import React from 'react';
import { InfoIcon } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies
 */
import { useCookie } from '../../../../stateProviders';

interface OrphanedUnMappedInfoDisplayProps {
  frameIdList: number[];
}

const OrphanedUnMappedInfoDisplay = ({
  frameIdList,
}: OrphanedUnMappedInfoDisplayProps) => {
  const tabFrames = useCookie(({ state }) => state.tabFrames);

  if (!tabFrames) {
    return <span>{''}</span>;
  }

  if (frameIdList.length === 0) {
    return (
      <span
        className="flex"
        title="Cookies that could not be mapped to any frame."
      >
        <InfoIcon className="fill-granite-gray" />
        <span className="ml-[2px] block">Unmapped</span>
      </span>
    );
  }

  let tabFramesIDMap: Set<number> = new Set();

  Object.keys(tabFrames).forEach((url) => {
    const frameIds = tabFrames[url].frameIds;

    if (frameIds) {
      tabFramesIDMap = new Set([...tabFramesIDMap, ...frameIds]);
    }
  });

  let hasFrame = true;

  if (
    Array.from(tabFramesIDMap).filter((frameId) => {
      return frameIdList.includes(frameId);
    }).length === 0
  ) {
    hasFrame = false;
  }

  if (!hasFrame) {
    return (
      <span
        className="flex"
        title="Frames that set these cookies were removed from the DOM, leaving these cookies orphaned."
      >
        <InfoIcon className="fill-granite-gray" />
        <span className="ml-[2px] block">Orphaned</span>
      </span>
    );
  }
  return <span>{''}</span>;
};

export default OrphanedUnMappedInfoDisplay;
