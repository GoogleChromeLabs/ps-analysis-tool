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
import classNames from 'classnames';
import { noop } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { Export } from '../../icons';

interface ExportButtonProps {
  onClick?: () => void;
  title?: string;
  disable?: boolean;
}

const ExportButton = ({
  onClick,
  title = 'Export',
  disable = false,
}: ExportButtonProps) => {
  return (
    <button
      onClick={disable ? noop : onClick}
      title={title}
      className={classNames({
        'flex items-center text-center dark:text-mischka text-comet-black ':
          true,
        'hover:text-comet-grey hover:dark:text-bright-gray active:dark:text-mischka active:text-comet-black':
          !disable,
      })}
    >
      <Export />
    </button>
  );
};

export default ExportButton;
