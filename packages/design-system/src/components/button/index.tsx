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
  variant?: 'primary' | 'secondary' | 'danger' | 'small' | 'large';
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
        'rounded flex items-center text-center py-1 px-2 font-medium text-white dark:text-raisin-black',
        {
          'py-0.5 px-1.5 text-xs bg-sapphire dark:bg-baby-blue-eyes ':
            variant === 'small',
          'rounded-xs md:py-3.5 md:px-9 xxs:max-sm:p-2 xs:max-md:py-4 sm:max-md:px-2 bg-smurf-blue dark:bg-google-blue':
            variant === 'large',
          'bg-sapphire dark:bg-baby-blue-eyes': variant === 'primary',
          'bg-transparent text-raisin-black dark:text-bright-gray active:opacity-60':
            variant === 'secondary',
          'text-white dark:text-white bg-red-500': variant === 'danger',
        },
        {
          'opacity-70 cursor-default': disabled,
          'hover:bg-tufts-blue dark:hover:bg-pale-cornflower-blue':
            !disabled && (variant === 'small' || variant === 'primary'),
          'hover:bg-beteleguese dark:hover:bg-bright-navy-blue':
            !disabled && variant === 'large',
          'hover:opacity-80': !disabled && variant === 'secondary',
          'hover:bg-red-600': !disabled && variant === 'danger',
        }
      )}
    >
      {text}
    </button>
  );
};

export default Button;
