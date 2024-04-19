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
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import { Accordion, FeatureList } from '../../components';
import type { AccordionProps } from '../../types';

const GISAccordion = ({ matches }: AccordionProps) => {
  if (!matches) {
    return null;
  }

  const featuresCount = matches.length;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion
      title={I18n.getMessage('gISTitle')}
      featuresText={I18n.getMessage('featureCount', [featuresCount.toString()])}
    >
      <p
        className="dark:text-bright-gray"
        dangerouslySetInnerHTML={{
          __html: I18n.getMessage('gISNote', [
            `<a className="text-bright-navy-blue dark:text-jordy-blue" target="_blank" href="${addUTMParams(
              'https://developers.google.com/identity/gsi/web/guides/fedcm-migration?utm_source=lighthouse&utm_medium=cli'
            )}" rel="noreferrer">`,
            '</a>',
          ]),
        }}
      />
      <FeatureList matches={matches} />
    </Accordion>
  );
};

export default GISAccordion;
