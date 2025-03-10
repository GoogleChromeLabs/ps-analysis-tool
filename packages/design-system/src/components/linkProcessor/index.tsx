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
import Link from '../link';

interface LinkProcessorProps {
  text: string;
  to?: string[];
  queries?: string[];
  links?: string[];
  sameTab?: boolean;
}

/**
 * LinkProcessor Component
 * @todo This component props are getting too complex. Consider refactoring it.
 *
 * This component processes a text string containing anchor placeholders (`<a>`)
 * and replaces them with interactive links. It enables navigation within a sidebar
 * while supporting query parameters and external links that can either open in the same tab
 * or a new tab based on user interaction.
 *
 * ## Features:
 * - Parses text input and converts placeholders (`<a>`) into clickable links.
 * - Supports navigation to different sections using query parameters.
 * - Allows external links to open in a new tab when Ctrl or Cmd is held.
 * - Provides an option to open links in the same tab.
 * - Uses `useSidebar` to update the selected sidebar item dynamically.
 * @param props - Component properties.
 * @param props.text - The text string containing `<a>` placeholders for links.
 * @param props.to - List of keys corresponding to navigation targets.
 * @param [props.queries] - Optional list of query parameters for navigation.
 * @param [props.links] - Optional list of external links for anchors.
 * @param props.sameTab - Determines whether links should open in the same tab.
 * @returns A processed JSX structure with interactive links.
 */
const LinkProcessor = ({
  text,
  to,
  queries,
  links,
  sameTab = false,
}: LinkProcessorProps) => {
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
            let button;

            if (sameTab) {
              button = (
                <Link
                  href={links?.[idx] || '#'}
                  className="text-bright-navy-blue dark:text-jordy-blue"
                >
                  {textToProcess.slice(stringStart, stringEnd)}
                </Link>
              );
            } else {
              const _to = to?.[idx] || '';
              button = (
                <a
                  href={links?.[idx] || '#'}
                  onClick={(event) =>
                    navigateTo(
                      event,
                      _to,
                      queries?.[idx] || '',
                      links?.[idx] || ''
                    )
                  }
                  className="text-bright-navy-blue dark:text-jordy-blue"
                >
                  {textToProcess.slice(stringStart, stringEnd)}
                </a>
              );
            }

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
    [links, navigateTo, queries, to, sameTab]
  );

  return (
    <>
      {processDescription(text).map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </>
  );
};

export default LinkProcessor;
