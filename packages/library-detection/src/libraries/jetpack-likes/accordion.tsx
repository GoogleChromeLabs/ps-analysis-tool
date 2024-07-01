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
import { Accordion, DetectionMessage } from '../../components';
import type { AccordionProps } from '../../types';
import { JETPACK_LIKES_HELP_URL } from './constants';
import { I18n } from '@google-psat/i18n';

const JetpackLikesAccordion = ({ domQueryMatches }: AccordionProps) => {
  if (!domQueryMatches) {
    return null;
  }

  const featuresCount = domQueryMatches.length;

  if (!featuresCount) {
    return null;
  }

  return (
    <Accordion
      title={I18n.getMessage('jetpackLikeButton')}
      isLoading={false}
      featuresText=""
    >
      <DetectionMessage
        libraryName={I18n.getMessage('jetpackLikeButton')}
        provider={I18n.getMessage('jetpack')}
        supportURL={JETPACK_LIKES_HELP_URL}
      />
    </Accordion>
  );
};

export default JetpackLikesAccordion;
