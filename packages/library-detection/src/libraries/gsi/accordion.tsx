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
import { addUTMParams } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { Accordion } from '../../components';
import type { AccordionProps } from '../../types';

const GSIAccordion = ({ matches }: AccordionProps) => {
  if (!matches) {
    return null;
  }

  const featuresCount = matches.length;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion title={'Deprecated Google Sign-In'} isLoading={false}>
      <p className="text-darkest-gray dark:text-bright-gray">
        The Google Sign-In JavaScript library is deprecated and is no longer
        supported. Some features of Google Identity Services are in use. Please
        review the following documentation and{' '}
        <a
          className="text-bright-navy-blue dark:text-jordy-blue"
          href={addUTMParams(
            'https://developers.google.com/privacy-sandbox/3pcd/guides/identity#federated_identity'
          )}
          target="_blank"
          rel="noreferrer"
        >
          migrate
        </a>{' '}
        if necessary.
      </p>
    </Accordion>
  );
};

export default GSIAccordion;
