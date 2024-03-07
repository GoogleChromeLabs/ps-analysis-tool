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
import { addUTMParams } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { getCurrentTabId } from '../../../../../../utils/getCurrentTabId';

interface Navigator {
  cookieDeprecationLabel: {
    getValue: () => Promise<string>;
  };
}

const ExperimentGroup = () => {
  const [label, setLabel] = useState('');
  const [isLibrarySupported, setIsLibrarySupported] = useState(false);

  useEffect(() => {
    (async () => {
      const tabId = await getCurrentTabId();

      if (!tabId) {
        return;
      }

      const [queryResult] = await chrome.scripting.executeScript({
        target: { tabId: Number(tabId), allFrames: false },
        func: () => {
          // Feature detect temporary API first
          return new Promise((resolve) => {
            if ('cookieDeprecationLabel' in navigator) {
              (navigator as Navigator).cookieDeprecationLabel
                .getValue()
                .then(resolve);
            } else {
              // If cookieDeprecationLabel is not available, they are not part of the 1% group.
              // @see https://developers.google.com/privacy-sandbox/setup/web/chrome-facilitated-testing#accessing_the_cookiedeprecationlabel_javascript_api
              resolve(null);
            }
          });
        },
      });

      if (queryResult?.result !== null) {
        setIsLibrarySupported(true);
      }

      const labelText: string =
        queryResult && queryResult?.result ? String(queryResult?.result) : '';

      setLabel(labelText);
    })();
  }, []);

  return (
    <div
      className="p-3 flex-1 bg-anti-flash-white dark:bg-charleston-green rounded-md"
      data-testid="experiment-group"
    >
      <h4 className="text-base font-medium text-davys-grey dark:text-anti-flash-white mb-1">
        Is Your Browser Part of the Experimental Group?
      </h4>
      {isLibrarySupported ? (
        <div className="overflow-auto mt-2">
          <p>Your browser is part of an experimental group labeled as:</p>
          <p>
            <strong>Label:</strong> <span>{String(label)}</span>
          </p>
          <p className="mt-3">
            For more information about this label, please visit the{' '}
            <a
              className="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80 underline"
              href={addUTMParams(
                'https://developers.google.com/privacy-sandbox/setup/web/chrome-facilitated-testing'
              )}
              target="_blank"
              rel="noreferrer"
            >
              Chrome-facilitated testing{' '}
            </a>
            {''} documentation.
          </p>
        </div>
      ) : (
        <div className="overflow-auto mt-2">
          <p>Your browser is not part of any experimental group.</p>
        </div>
      )}
    </div>
  );
};

export default ExperimentGroup;
