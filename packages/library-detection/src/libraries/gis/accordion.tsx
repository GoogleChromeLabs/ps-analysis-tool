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
import { addUTMParams } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { Accordion } from '../../components';
import type { AccordionProps } from '../../types';
import { I18n } from '@google-psat/i18n';

const GISAccordion = ({ matches }: AccordionProps) => {
  if (!matches) {
    return null;
  }

  const featuresCount = matches.length;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion title={I18n.getMessage('gISTitle')}>
      <p className="text-darkest-gray dark:text-bright-gray">
        {I18n.getMessage('gISNote', [
          `<a target="_blank" className="text-bright-navy-blue dark:text-jordy-blue" href=${addUTMParams(
            'https://developers.google.com/identity/gsi/web/guides/fedcm-migration'
          )} rel="noreferrer">`,
          `</a>`,
        ])}
      </p>
    </Accordion>
  );
};

export default GISAccordion;
