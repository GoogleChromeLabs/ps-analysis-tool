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
import { JsonView } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

type BidderSettingsPanelProps = {
  config: PrebidConfig['bidderSettings'];
};

const JSONViewerWrapper = ({ config }: BidderSettingsPanelProps) => {
  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-american-silver dark:border-quartz flex flex-col">
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full minimum-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {config ? (
          <div className="text-xs py-1 px-1.5">
            <JsonView src={config} />
          </div>
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
              {I18n.getMessage('selectRowToPreview')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JSONViewerWrapper;
