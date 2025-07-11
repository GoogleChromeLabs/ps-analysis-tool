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
import { Refresh as RefreshIcon } from '../../icons';

interface RefreshButtonProps {
  onClick?: () => void;
  title?: string;
}
const RefreshButton = ({ onClick, title = 'Refresh' }: RefreshButtonProps) => {
  return (
    <button
      onClick={onClick ? onClick : undefined}
      title={title}
      className={
        'flex items-center justify-center h-full text-center dark:text-mischka text-comet-black hover:text-comet-grey dark:hover:text-bright-gray dark:active:text-mischka active:text-comet-black pt-[1px]'
      }
    >
      <RefreshIcon className="h-[13px] w-[13px]" />
    </button>
  );
};

export default RefreshButton;
