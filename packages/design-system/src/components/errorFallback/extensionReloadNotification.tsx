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
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import Button from '../button';
interface ExtensionReloadNotificationProps {
  tabId?: number;
}

const ExtensionReloadNotification = ({
  tabId,
}: ExtensionReloadNotificationProps) => {
  return (
    <div className="w-full h-full px-2 flex flex-col items-center justify-center border-b border-american-silver dark:border-quartz bg-white dark:bg-charleston-green dark:text-white">
      <p className="text-xl text-center px-4">
        {I18n.getMessage('dsExtensionUpdated')}
      </p>
      <div className="ml-2 mt-4">
        <Button
          onClick={() => {
            window.location.reload();
            if (localStorage.getItem('psatOpenedAfterPageLoad') && tabId) {
              try {
                chrome.tabs.reload(tabId);
                localStorage.removeItem('psatOpenedAfterPageLoad');
              } catch (error) {
                //Fail silenlty
              }
            }
          }}
          text={I18n.getMessage('dsRefreshPanel')}
        />
      </div>
    </div>
  );
};

export default ExtensionReloadNotification;
