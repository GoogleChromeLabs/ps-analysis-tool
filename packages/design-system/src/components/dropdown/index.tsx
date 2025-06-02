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
 * External dependencies
 */
import React from 'react';
/**
 * Internal dependencies
 */
import OptionsComponent, { type OptGroup, type Option } from './options';

interface DropdownProps {
  groups?: OptGroup[];
  options?: Option[];
  value: string;
  onChange: (value: string) => void;
  ref?: React.Ref<HTMLSelectElement>;
  placeholder?: string;
}

const Dropdown = ({
  options,
  groups,
  value,
  onChange,
  ref,
  placeholder = '',
}: DropdownProps) => {
  return (
    <select
      ref={ref}
      className="border border-hex-gray dark:border-quartz rounded px-3 py-2 w-full text-sm text-raisin-black dark:text-bright-gray"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <OptionsComponent
        groups={groups}
        options={options}
        placeholder={placeholder}
      />
    </select>
  );
};

export default Dropdown;
