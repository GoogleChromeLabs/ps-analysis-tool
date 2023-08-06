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
import {
  MatrixComponent,
  MatrixComponentHorizontal,
} from '../../../../../../design-system/components';
import { COLOR_MAP } from '../../../../../../design-system/theme/colors';

const CookiesMatrix = () => {
  const matrixComponentProps = {
    title: 'Functional Cookies',
    description:
      'These are essential cookies that are necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size).',
    color: COLOR_MAP.functional,
    expand: true,
    textClassName: 'text-functional',
    containerClasses: 'mb-5 pb-5 pl-3 border-b border-bright-gray',
  };
  const matrixComponentHorizontalProps = {
    title: 'Invalid Cookies',
    description:
      'The cookies which could not be stored in the cookie jar of the browser as they were invalid.',
    expand: false,
    containerClasses: 'mb-5 pl-3',
  };

  return (
    <div className="max-w-[700px]">
      <div className="flex gap-5">
        <div>
          <h4 className="mb-5 pb-3 border-b border-bright-gray text-xs font-bold text-darkest-gray">
            CookiesMatrix
          </h4>
          <MatrixComponent {...matrixComponentProps} />
          <MatrixComponent {...matrixComponentProps} />
        </div>
        <div>
          <h4 className="mb-5 pb-3 border-b border-bright-gray text-xs font-bold text-darkest-gray text-right">
            <button>Expand View</button>
          </h4>
          <MatrixComponent {...matrixComponentProps} />
          <MatrixComponent {...matrixComponentProps} />
        </div>
      </div>
      <div>
        <MatrixComponentHorizontal {...matrixComponentHorizontalProps} />
        <MatrixComponentHorizontal {...matrixComponentHorizontalProps} />
        <MatrixComponentHorizontal {...matrixComponentHorizontalProps} />
      </div>
    </div>
  );
};

export default CookiesMatrix;
