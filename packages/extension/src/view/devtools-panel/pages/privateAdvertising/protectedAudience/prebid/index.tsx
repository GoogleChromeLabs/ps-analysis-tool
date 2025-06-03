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
import { InfoIcon } from '@google-psat/design-system';
/**
 * Internal dependencies
 */
import Panel from './panel';
import { useProtectedAudience } from '../../../../stateProviders';

const Prebid = () => {
  const { prebidResponse } = useProtectedAudience(({ state }) => ({
    prebidResponse: state.prebidResponse,
  }));

  if (!prebidResponse?.prebidExists) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="px-4 pt-2 mx-auto leading-5 flex gap-1 justify-center items-baseline max-w-4xl">
          <div>
            <InfoIcon className="w-3 h-3 fill-granite-gray" />
          </div>
          <div
            className="text-sm text-center text-gray dark:text-bright-gray"
            style={{ whiteSpace: 'pre-line' }}
          >
            Prebid.js was not found on this page.
          </div>
        </div>
      </div>
    );
  }

  return <Panel prebidResponse={prebidResponse} />;
};

export default Prebid;
