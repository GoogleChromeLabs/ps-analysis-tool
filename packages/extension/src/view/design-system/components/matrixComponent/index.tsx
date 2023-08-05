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
import Circle from '../circle';
import { COLOR_MAP } from '../../theme/colors';

const MatrixComponent = () => {
  return (
    <div className="flex gap-[15px]">
      <div>
        <Circle color={COLOR_MAP.functional} />
      </div>
      <div className="w-[265px]">
        <h4 className="mt-[-3px] mb-1 font-semibold text-xs">
          Functional Cookies
        </h4>
        <div className="text-functional text-2xl mb-1">3</div>
        <p className="text-xs">
          These are essential cookies that are necessary for a website to
          function properly. They enable basic functionalities such as page
          navigation, access to secure areas, and remembering user preferences
          (e.g., language, font size).
        </p>
      </div>
    </div>
  );
};

export default MatrixComponent;
