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
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import { getCurrentTabId } from '../../../../../../utils/getCurrentTabId';

const ExperimentGroup = () => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    (async () => {
      const tabId = await getCurrentTabId();

      if (!tabId) {
        return;
      }

      const queryResult = await chrome.scripting.executeScript({
        target: { tabId: Number(tabId), allFrames: false },
        func: () => {
          // Feature detect temporary API first
          return new Promise((resolve, reject) => {
            if ('cookieDeprecationLabel' in navigator) {
              // Request value and resolve promise
              navigator.cookieDeprecationLabel.getValue().then(resolve);
            } else {
              reject('Not Supported');
            }
          });
        },
      });

      setLabel(queryResult ? queryResult[0]?.result : '');
    })();
  }, []);

  return (
    <div className="p-3 flex-1 bg-anti-flash-white dark:bg-charleston-green rounded-md">
      <h4 className="text-base font-medium text-davys-grey dark:text-anti-flash-white mb-1">
        Is Your Browser Part of the Experimental Group?
      </h4>
      <div className="overflow-auto">
        <p>Label: {label}</p>
      </div>
    </div>
  );
};

export default ExperimentGroup;
