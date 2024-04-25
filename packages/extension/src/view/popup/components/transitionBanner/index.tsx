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
import { Button, ClearIcon } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
// @ts-ignore
import PSIcon from '../../../../../icons/icon.svg';

interface TransitionBannerProps {
  closeBanner: () => void;
}

const TransitionBanner = ({ closeBanner }: TransitionBannerProps) => {
  return (
    <div className="flex-1 flex items-center flex-col h-full w-full bg-bright-gray rounded-lg p-3">
      <button className="h-fit w-full text-dim-gray" onClick={closeBanner}>
        <ClearIcon className="w-3 h-3 float-right" />
      </button>
      <PSIcon className="w-12 h-12" />
      <h3 className="text-base font-bold text-gray-900 mt-6">
        PSAT Extension has a new home
      </h3>
      <p className="max-w-[226px] text-sm text-center text-charcoal mt-6">
        Please download the new version from the Chrome web store
      </p>
      <Button text="Add to Chrome" extraClasses="mt-6 py-2" />
    </div>
  );
};

export default TransitionBanner;
