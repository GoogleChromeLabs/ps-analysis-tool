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
import {
  InfoIcon,
  InternalNavigationForAnchor,
  SIDEBAR_ITEMS_KEYS,
} from '@google-psat/design-system';
import React from 'react';

/**
 * Internal dependencies.
 */
import { NAVIGATION_TAGS } from '../../wiki';

interface EvaluationEnvironmentProps {
  text: string;
}

const EvaluationEnvironment = ({ text }: EvaluationEnvironmentProps) => {
  return (
    <div className="px-4 pt-2 mx-auto leading-5 flex gap-1 justify-center items-center max-w-2xl">
      <div>
        <InfoIcon className="w-3 h-3 fill-granite-gray" />
      </div>
      <div
        className="text-xxxs text-center text-gray dark:text-bright-gray"
        style={{ whiteSpace: 'pre-line' }}
      >
        <InternalNavigationForAnchor
          text={text}
          to={[SIDEBAR_ITEMS_KEYS.WIKI]}
          queries={[NAVIGATION_TAGS.EVALUATION_ENVIRONMENT]}
        />
      </div>
    </div>
  );
};

export default EvaluationEnvironment;
