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

const GISAccordion = ({ matches }: AccordionProps) => {
  const featuresCount = matches && matches.length ? matches.length : 0;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion
      title={'Avoid use of unsupported Google Identity Services features.'}
      featuresText={`${featuresCount} features`}
    >
      <p className="dark:text-bright-gray">
        Due to Privacy Sandbox enforcements some features are backward
        incompatible or deprecated. This report performs a page scan for script
        src elements and affected JavaScript objects and methods. Review the
        following features in and{' '}
        <a
          className="text-bright-navy-blue dark:text-jordy-blue"
          target="_blank"
          href={addUTMParams(
            'https://developers.google.com/identity/gsi/web/guides/fedcm-migration?utm_source=lighthouse&utm_medium=cli'
          )}
          rel="noreferrer"
        >
          migrate
        </a>{' '}
        if necessary.
      </p>
      <FeatureList matches={matches} />
    </Accordion>
  );
};

export default GISAccordion;
