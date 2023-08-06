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
import CircleEmpty from '../circle/circleEmpty';

interface MatrixComponentHorizontalProps {
  color: string;
  title: string;
  description: string;
  expand?: boolean;
}

const MatrixComponentHorizontal = ({
  title,
  description,
  expand = false,
}: MatrixComponentHorizontalProps) => {
  return (
    <div className="max-w-[672px]">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <CircleEmpty />
          <h4 className="-mt-[3px] font-semibold text-xs">{title}</h4>
        </div>
        <div className="text-xs text-dark-gray font-semibold -mt-[2px]">3</div>
      </div>
      <div className="mt-2 ml-6 pl-px">
        {description && expand && <p className="text-xs">{description}</p>}
      </div>
    </div>
  );
};

export default MatrixComponentHorizontal;
