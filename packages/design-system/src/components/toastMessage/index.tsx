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
import { I18n } from '@ps-analysis-tool/i18n';

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
  buttonText?: string;
}
const ToastMessage = ({
  text,
  onClick,
  additionalStyles = '',
  textAdditionalStyles = '',
  variant = 'large',
  buttonText = I18n.getMessage('reload'),
}: ToastMessageProps) => {
  return (
    <div
      className={`${additionalStyles} w-full overflow-auto z-2 bg-white dark:bg-charleston-green shadow-xxs`}
    >
      <div className="flex items-center justify-between p-4 gap-2 min-w-[20rem]">
        <p className={`dark:text-white ${textAdditionalStyles}`}>{text}</p>
        <Button text={buttonText} onClick={onClick} variant={variant} />
      </div>
    </div>
  );
};

export default ToastMessage;
