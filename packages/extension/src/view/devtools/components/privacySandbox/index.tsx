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
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import { ProgressBar } from '../../../design-system/components';

const PrivacySandbox = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />}
      <iframe
        className={`${loading ? 'hidden' : 'visible'}`}
        onLoad={() => setLoading(false)}
        data-testid="privacy-sandbox-content"
        src="https://privacysandbox.com"
        width="100%"
        height="100%"
      />
    </>
  );
};

export default PrivacySandbox;
