/*
 * Copyright 2024 Google LLC
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
import React, { useCallback } from 'react';

/**
 * Internal dependencies.
 */
import { useSidebar } from '../sidebar';

interface InternalNavigationForAnchorProps {
  text: string;
  to: string[];
  queries?: string[];
  links?: string[];
}

const InternalNavigationForAnchor = ({
  text,
  to,
  queries,
  links,
}: InternalNavigationForAnchorProps) => {
  const updateSelectedItemKey = useSidebar(
    ({ actions }) => actions.updateSelectedItemKey
  );

  const navigateTo = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      key: string,
      query: string,
      link: string
    ) => {
      event.preventDefault();

      if (event.ctrlKey || event.metaKey) {
        if (link) {
          chrome?.tabs.create({
            url: link,
          });

          return;
        }
      }

      updateSelectedItemKey(key, query);
    },
    [updateSelectedItemKey]
  );

  const processDescription = useCallback(
    (textToProcess: string) => {
      let anchorIdxToNavigate = 0;
      const elements = [];
      let stringStart = 0,
        stringEnd = 0;

      // Use two pointers to find anchor tags in the description string and replace them with buttons
      // stringStart and stringEnd are used to keep track of the start and end of the current string
      // The anchor tags should not have any attributes
      while (stringEnd < textToProcess.length) {
        if (
          textToProcess[stringEnd] === '<' &&
          stringEnd + 1 < textToProcess.length
        ) {
          if (textToProcess[stringEnd + 1] === 'a') {
            elements.push(
              <span>{textToProcess.slice(stringStart, stringEnd)}</span>
            );
          } else {
            const idx = anchorIdxToNavigate;
            const button = (
              <a
                href={links?.[idx] || '#'}
                onClick={(event) =>
                  navigateTo(
                    event,
                    to[idx],
                    queries?.[idx] || '',
                    links?.[idx] || ''
                  )
                }
                className="text-bright-navy-blue dark:text-jordy-blue"
              >
                {textToProcess.slice(stringStart, stringEnd)}
              </a>
            );

            elements.push(button);
            stringEnd++;
            anchorIdxToNavigate++;
          }

          stringEnd += 2;
          stringStart = stringEnd + 1;
        }

        stringEnd++;
      }

      // Add the remaining string to the elements array
      if (stringStart < textToProcess.length) {
        elements.push(<span>{textToProcess.slice(stringStart)}</span>);
      }

      return elements;
    },
    [links, navigateTo, queries, to]
  );

  return (
    <>
      {processDescription(text).map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </>
  );
};

export default InternalNavigationForAnchor;
