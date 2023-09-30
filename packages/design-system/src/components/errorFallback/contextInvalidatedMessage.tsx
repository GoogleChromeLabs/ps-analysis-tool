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

const ContextInvalidatedMessage = () => {
  return (
    <div className="dark:text-bright-gray text-chart-label text-base mb-5 p-10 text-center">
      <p>
        Uh oh! It appears that the extension has been updated while the devtools
        were open.
      </p>
      <p>Please close and reopen the devtools panel.</p>
    </div>
  );
};

export default ContextInvalidatedMessage;
