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
import { Accordion, FeatureList } from '../../components';
import type { AccordionProps } from '../../types';

const GSIAccordion = ({ matches }: AccordionProps) => {
  const featuresCount = matches && matches.length ? matches.length : 0;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion
      title={'Avoid use of deprecated Google Sign-In functionality.'}
      isLoading={false}
      featuresText={`${featuresCount} features`}
    >
      <p className="dark:text-bright-gray">
        The Google Sign-In JavaScript library is deprecated and is no longer
        supported. Review the following features and consider{' '}
        <a
          className="text-bright-navy-blue dark:text-jordy-blue"
          href={addUTMParams(
            'https://developers.google.com/privacy-sandbox/3pcd/guides/identity#federated_identity'
          )}
          target="_blank"
          rel="noreferrer"
        >
          migrating
        </a>{' '}
        to a newer library if necessary.
      </p>
      <FeatureList matches={matches} />
    </Accordion>
  );
};

export default GSIAccordion;
