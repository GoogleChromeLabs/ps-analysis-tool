/*
 * Copyright 2025 Google LLC
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
import { ArrowUp } from '@google-psat/design-system';
import classNames from 'classnames';
import { useState } from 'react';

interface ExtraOptionsProps {
  node: () => React.ReactNode;
}
const ExtraOptions = ({ node }: ExtraOptionsProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      data-testid="extra-option-section"
      className={classNames('w-full flex flex-col ml-6', {
        'divide-y divide-hex-gray dark:divide-quartz': open,
      })}
    >
      <div className="flex flex-row justify-between items-center">
        <span className="text-xs dark:text-bright-gray">Extra Options</span>
        <button
          className="flex gap-2 justify-end items-baseline dark:text-bright-gray cursor-pointer"
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <ArrowUp
            className={classNames('mr-2', open && 'rotate-180 -translate-y-1')}
          />
        </button>
      </div>
      <div className={classNames({ hidden: !open })}>{node()}</div>
    </div>
  );
};

export default ExtraOptions;
