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
export interface Option {
  value: string;
  label: string;
}

export interface OptGroup {
  label: string;
  options: Option[];
  disabled?: boolean;
}

interface OptionsProps {
  options?: Option[];
  groups?: OptGroup[];
  placeholder?: string;
}

const OptionsComponent = ({ options, groups, placeholder }: OptionsProps) => {
  if (options) {
    return (
      <>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </>
    );
  }

  if (groups) {
    return (
      <>
        {groups.map((group, i) => (
          <optgroup key={i} label={group.label} disabled={group.disabled}>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </>
    );
  }
  return <></>;
};

export default OptionsComponent;
