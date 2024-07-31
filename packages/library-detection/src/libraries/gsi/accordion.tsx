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
import { addUTMParams } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { Accordion } from '../../components';
import type { AccordionProps } from '../../types';
import { I18n } from '@google-psat/i18n';

const GSIAccordion = ({ matches, urlCount }: AccordionProps) => {
  if (!matches) {
    return null;
  }

  const featuresCount = matches.length;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion
      title={I18n.getMessage('gSITitle')}
      isLoading={false}
      urlCount={urlCount}
    >
      <p
        className="text-darkest-gray dark:text-bright-gray"
        dangerouslySetInnerHTML={{
          __html: I18n.getMessage('gSInote', [
            `<a target="_blank" class="text-bright-navy-blue dark:text-jordy-blue" href=${addUTMParams(
              'https://developers.google.com/privacy-sandbox/3pcd/guides/identity#federated_identity'
            )} rel="noreferrer">`,
            `</a>`,
          ]),
        }}
      />
    </Accordion>
  );
};

export default GSIAccordion;
