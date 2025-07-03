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

interface MessageBoxProps {
  headerText: string;
  bodyText: string;
  width?: string;
  additionalClasses?: string;
  bodyTextClass?: string;
  headerTextClass?: string;
}
const MessageBox = ({
  headerText,
  bodyText,
  width = 'max-w-2xl',
  additionalClasses = '',
  bodyTextClass = '',
  headerTextClass = '',
}: MessageBoxProps) => {
  return (
    <div
      className={`bg-hsl-light dark:hsl-dark py-4 my-3 px-3 leading-5 ${width} ${additionalClasses}`}
    >
      <p
        className={`text-warning-red dark:text-warning-orange font-bold ${headerTextClass}`}
      >
        {headerText}
      </p>
      <p className={`text-raisin-black dark:text-bright-gray ${bodyTextClass}`}>
        {bodyText}
      </p>
    </div>
  );
};

export default MessageBox;
