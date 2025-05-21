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
import React from 'react';
import { Resizable } from 're-resizable';
import { JsonView } from '@google-psat/design-system';
/**
 * Internal dependencies
 */
import { useProtectedAudience } from '../../../stateProviders';

const PrebidPanel = () => {
  const { functionKeys, getPrebidData, selectedProperty, prebidResponse } =
    useProtectedAudience(({ state, actions }) => ({
      functionKeys: state.functionKeys,
      getPrebidData: actions.getPrebidData,
      selectedProperty: state.selectedProperty,
      prebidResponse: state.prebidResponse,
    }));

  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-american-silver dark:border-quartz flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="15%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
      >
        <div className="flex flex-row flex-wrap items-center justify-evenly gap-4 overflow-auto h-full">
          {functionKeys.map((key) => {
            return (
              <button
                className="bg-cultured-grey text-raisin-black py-2 px-2 rounded border border-dark-grey text-base hover:bg-light-gray hover:border-american-silver"
                key={key}
                onClick={() => getPrebidData(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      </Resizable>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedProperty ? (
          <div className="text-xs py-1 px-1.5">
            <JsonView src={prebidResponse ?? {}} />
          </div>
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
              Click on a key to get prebidResponse
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrebidPanel;
