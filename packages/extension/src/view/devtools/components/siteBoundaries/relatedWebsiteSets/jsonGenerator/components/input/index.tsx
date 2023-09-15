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

interface RWSInputProps {
  inputLabel: string;
  inputValue: string;
  inputPlaceholder: string;
  inputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  formValidationFailed: boolean;
}

const RWSInput = ({
  inputLabel,
  inputValue,
  inputPlaceholder,
  inputChangeHandler,
  error,
  formValidationFailed,
}: RWSInputProps) => {
  return (
    <div className="flex flex-col gap">
      <label className="text-sm">{inputLabel}</label>
      <input
        type="text"
        className={classNames(
          'my-1 py-1 px-2 outline-none border dark:bg-raisin-black dark:text-bright-gray text-outer-space-crayola',
          {
            [formValidationFailed
              ? 'border-red-500 dark:border-red-500'
              : 'border-gainsboro dark:border-quartz']: error,
          },
          {
            'border-green-500 dark:border-green-500': !error && inputValue,
          }
        )}
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={inputChangeHandler}
      />
      {error && formValidationFailed && (
        <span className="text-red-500 text-xs mt-2">{error}</span>
      )}
    </div>
  );
};

export default RWSInput;
