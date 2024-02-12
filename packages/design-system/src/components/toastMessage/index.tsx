/*
 * Copyright 2024 Google LLC
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

/**
 * Internal dependencies.
 */
import Button from '../button';

interface ToastMessageProps {
  text: string;
  onClick: () => void;
  additionalStyles?: string;
  textAdditionalStyles?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'small' | 'large';
}

const ToastMessage = ({
  text,
  onClick,
  additionalStyles = '',
  textAdditionalStyles = '',
  variant = 'large',
}: ToastMessageProps) => {
  return (
    <div
      className={`${additionalStyles} flex flex-row w-full absolute z-2 left-0 bottom-0 items-center justify-between bg-white dark:bg-charleston-green shadow-xxs py-4`}
    >
      <div className={`w-5/6 dark:text-white ${textAdditionalStyles}`}>
        {text}
      </div>
      <div className="w-1/6">
        <Button text="Reload All Tabs" onClick={onClick} variant={variant} />
      </div>
    </div>
  );
};

export default ToastMessage;
