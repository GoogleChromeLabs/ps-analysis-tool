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
import {
  Ellipse,
  BorderProgressBar,
  ChevronDown,
} from '@ps-analysis-tool/design-system';
import classNames from 'classnames';

interface AccodionHeadingProps {
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  loading: boolean;
  isOpen: boolean;
  featuresText: string;
}

const AccordionHeading = ({
  setIsOpen,
  title,
  loading,
  isOpen,
  featuresText,
}: AccodionHeadingProps) => {
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="transition-colors flex py-3 cursor-pointer"
    >
      <span className="flex items-center px-2">
        <Ellipse />
      </span>
      <p className="flex-1 dark:text-bright-gray font-medium">
        {title}
        {featuresText && (
          <span className="text-gray ml-2 dark:text-bright-gray">
            — {featuresText}
          </span>
        )}
      </p>
      <span className="flex items-center px-2 dark:text-bright-gray">
        <ChevronDown
          className={classNames('fill-granite-gray', {
            'rotate-180': isOpen,
          })}
        />
      </span>
      {loading && (
        <div className="absolute top-0 left-0 w-full">
          <BorderProgressBar />
        </div>
      )}
    </div>
  );
};

export default AccordionHeading;
