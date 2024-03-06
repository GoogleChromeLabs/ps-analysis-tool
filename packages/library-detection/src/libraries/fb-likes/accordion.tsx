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

/**
 * Internal dependencies.
 */
import { Accordion } from '../../components';
import type { AccordionProps } from '../../types';
import { FB_LIKES_HELP_URL } from './constants';

const FBLikesAccordion = ({ domQueryMatches }: AccordionProps) => {
  const featuresCount =
    domQueryMatches && domQueryMatches.length ? domQueryMatches.length : 0;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion
      title={'Facebook Like Plugin.'}
      isLoading={false}
      featuresText=""
    >
      <p className="dark:text-bright-gray">
        Facebook like plugin is known to experience issues due to the phaseout
        of third-party cookies. For more information, please visit the Facebook{' '}
        <a
          target="_blank"
          className="text-bright-navy-blue dark:text-jordy-blue"
          href={FB_LIKES_HELP_URL}
          rel="noreferrer"
        >
          support forum
        </a>
        .
      </p>
    </Accordion>
  );
};

export default FBLikesAccordion;
