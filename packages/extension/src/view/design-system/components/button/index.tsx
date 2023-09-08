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
import classNames from 'classnames';
import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
}
const Button = ({
  text,
  onClick = undefined,
  type = 'button',
  variant = 'primary',
}: ButtonProps) => {
  return (
    <button
      data-test-id="button"
      type={type}
      onClick={onClick ? onClick : undefined}
      className={classNames('py-1 px-2 rounded font-medium', {
        'text-white dark:bg-absolute-zero-crayola bg-absolute-zero-crayola hover:bg-ocean-boat-blue':
          variant === 'primary',
        'bg-transparent dark:bg-transparent dark:text-bright-gray text-raisin-black':
          variant === 'secondary',
        'text-white dark:text-white dark:bg-red-500 bg-red-500':
          variant === 'danger',
      })}
    >
      {text}
    </button>
  );
};

export default Button;
