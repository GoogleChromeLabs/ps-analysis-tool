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
 * External dependencies.
 */
import { FrameContent, IncognitoIcon } from '@google-psat/design-system';
import React from 'react';

type ContentPanelProps = {
  onClick?: () => void;
  frameColor?: string;
};

const ContentPanel = ({ onClick, frameColor }: ContentPanelProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[400px] min-w-[400px] h-[450px] lg:w-[800px] lg:min-w-[600px] lg:h-[400px] overflow-hidden flex justify-center items-center p-8">
        <FrameContent color={frameColor}>
          <div className="text-center flex flex-col items-center gap-2 text-raisin-black dark:text-bright-gray">
            <div className="mb-3 lg:mb-5 scale-125 lg:scale-150">
              <IncognitoIcon height={45} />
            </div>

            <h3 className="font-semibold text-xl lg:text-2xl">
              Incognito Mode
            </h3>

            <p className=" pb-2 mb-1 text-sm lg:text-base text-justify">
              {' '}
              Incognito mode allows you to use a web browser without saving
              certain local data from your Browse session. Complementing this,
              the Privacy Sandbox initiative enhances privacy across the web by
              disabling third-party cookies and hiding users&apos; IP addresses
              from third-party sites to reduce tracking.
            </p>
            <div className="flex justify-center mt-1">
              <button
                className="bg-cultured-grey text-raisin-black py-1 px-4 rounded border border-dark-grey text-xs hover:bg-light-gray hover:border-american-silver"
                onClick={onClick}
              >
                Open incognito tab
              </button>
            </div>
          </div>
        </FrameContent>
      </div>
    </div>
  );
};

export default ContentPanel;
