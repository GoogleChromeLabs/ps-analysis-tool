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
  text: string | React.ReactNode;
  title?: string;
  name?: string;
  onClick?: () => void;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'large';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  extraClasses?: string;
  disabled?: boolean;
}
const Button = ({
  title = '',
  text,
  name = 'button',
  onClick = undefined,
  type = 'button',
  variant = 'primary',
  size = 'small',
  extraClasses = '',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      title={title}
      data-test-id="button"
      type={type}
      name={name}
      disabled={disabled}
      onClick={onClick ? onClick : undefined}
      className={classNames(
        extraClasses,
        'rounded flex items-center text-center py-1 px-2 font-medium',
        {
          'bg-sapphire dark:bg-baby-blue-eyes text-white dark:text-raisin-black':
            variant === 'primary' && typeof text === 'string',
          'bg-transparent text-raisin-black dark:text-bright-gray active:opacity-60':
            variant === 'secondary' && typeof text === 'string',
          'text-white dark:text-raisin-black bg-red-500':
            variant === 'danger' && typeof text === 'string',
          'text-white dark:text-raisin-black bg-green-500':
            variant === 'success' && typeof text === 'string',
        },
        {
          'opacity-70 cursor-default': disabled,
          'hover:bg-tufts-blue dark:hover:bg-pale-cornflower-blue':
            !disabled &&
            size === 'small' &&
            variant === 'primary' &&
            typeof text === 'string',
          'hover:bg-beteleguese dark:hover:bg-bright-navy-blue':
            !disabled &&
            size === 'large' &&
            variant === 'primary' &&
            typeof text === 'string',
          'hover:opacity-80':
            !disabled && variant === 'secondary' && typeof text === 'string',
          'hover:bg-red-600':
            !disabled && variant === 'danger' && typeof text === 'string',
        },
        {
          'py-0.5 px-1.5 text-xs': size === 'small',
          'rounded-xs md:py-3.5 md:px-9 xxs:max-sm:p-4 xs:max-md:py-4 sm:max-md:px-4':
            size === 'large',
        }
      )}
    >
      {text}
    </button>
  );
};

export default Button;
