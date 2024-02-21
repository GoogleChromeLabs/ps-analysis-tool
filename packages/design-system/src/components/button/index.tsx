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
  name?: string;
  onClick?: () => void;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'small' | 'large';
  extraClasses?: string;
}
const Button = ({
  text,
  name = 'button',
  onClick = undefined,
  type = 'button',
  variant = 'primary',
  extraClasses = '',
}: ButtonProps) => {
  switch (variant) {
    case 'small':
      return (
        <button
          data-test-id="button"
          type={type}
          name={name}
          onClick={onClick ? onClick : undefined}
          className={classNames(
            'rounded flex items-center text-center py-0.5 px-1.5 text-xs text-white dark:bg-baby-blue-eyes bg-sapphire hover:bg-tufts-blue dark:hover:bg-pale-cornflower-blue dark:text-raisin-black',
            extraClasses
          )}
        >
          {text}
        </button>
      );
    case 'large':
      return (
        <button
          data-test-id="button"
          type={type}
          name={name}
          onClick={onClick ? onClick : undefined}
          className={classNames(
            'font-medium rounded-xs flex items-center text-center md:py-3.5 md:px-9 xxs:max-sm:p-2 xs:max-md:py-4 sm:max-md:px-2 text-white dark:bg-google-blue bg-smurf-blue hover:bg-beteleguese dark:hover:bg-bright-navy-blue dark:text-raisin-black',
            extraClasses
          )}
        >
          {text}
        </button>
      );
    case 'primary':
      return (
        <button
          data-test-id="button"
          type={type}
          name={name}
          onClick={onClick ? onClick : undefined}
          className={classNames(
            'rounded flex items-center text-center py-1 px-2 font-medium text-white dark:bg-baby-blue-eyes bg-sapphire hover:bg-tufts-blue dark:hover:bg-pale-cornflower-blue dark:text-raisin-black',
            extraClasses
          )}
        >
          {text}
        </button>
      );
    case 'secondary':
      return (
        <button
          data-test-id="button"
          type={type}
          name={name}
          onClick={onClick ? onClick : undefined}
          className={classNames(
            'rounded flex items-center text-center py-1 px-2 font-medium bg-transparent dark:bg-transparent dark:text-bright-gray text-raisin-black active:opacity-60 hover:opacity-80',
            extraClasses
          )}
        >
          {text}
        </button>
      );
    case 'danger':
      return (
        <button
          data-test-id="button"
          type={type}
          name={name}
          onClick={onClick ? onClick : undefined}
          className={classNames(
            'rounded flex items-center text-center py-1 px-2 font-medium text-white dark:text-white dark:bg-red-500 bg-red-500 hover:bg-red-600',
            extraClasses
          )}
        >
          {text}
        </button>
      );
    default:
      return <></>;
  }
};

export default Button;
