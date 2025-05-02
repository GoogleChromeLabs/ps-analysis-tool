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
import { ArrowUp, ArrowDown } from '@google-psat/design-system';

interface SortButtonProps {
  sortOrder: 'asc' | 'desc';
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

const SortButton = ({ setSortOrder, sortOrder }: SortButtonProps) => {
  return (
    <span
      onClick={() => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      }}
    >
      {sortOrder === 'asc' ? (
        <ArrowUp className="dark:fill-bright-gray fill-granite-gray" />
      ) : (
        <ArrowDown className="dark:fill-bright-gray fill-granite-gray " />
      )}
    </span>
  );
};

export default SortButton;
