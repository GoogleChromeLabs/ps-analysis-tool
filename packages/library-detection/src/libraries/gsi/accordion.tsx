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

const GISAccordion = () => {
  return (
    <Accordion
      title={'Avoid use of unsupported Google Identity Services features.'}
    >
      <p>
        Due to Privacy Sandbox enforcements some features are backward
        incompatible or deprecated. This report performs a page scan for script
        src elements and affected JavaScript objects and methods. Review the
        following features in and{' '}
        <a
          className="text-medium-persian-blue"
          target="_blank"
          href="https://developers.google.com/identity/gsi/web/guides/fedcm-migration?utm_source=lighthouse&utm_medium=cli"
          rel="noreferrer"
        >
          migrate
        </a>{' '}
        if necessary.
      </p>
    </Accordion>
  );
};

export default GISAccordion;
