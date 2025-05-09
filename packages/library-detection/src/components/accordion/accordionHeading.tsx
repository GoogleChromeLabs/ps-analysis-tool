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
import {
  Ellipse,
  BorderProgressBar,
  ChevronDown,
} from '@google-psat/design-system';
import classNames from 'classnames';

interface AccodionHeadingProps {
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  loading: boolean;
  isOpen: boolean;
  featuresText: string;
  urlCount?: number;
}

const AccordionHeading = ({
  setIsOpen,
  title,
  loading,
  isOpen,
  featuresText,
  urlCount = 0,
}: AccodionHeadingProps) => {
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="transition-colors flex items-center py-3 cursor-pointer hover:opacity-90 active:opacity-60 hover:bg-[#f5f5f5] dark:hover:bg-[#1d1d1d] rounded-md"
    >
      <span className="flex items-center px-2 relative">
        <Ellipse className={urlCount ? 'w-6 h-6' : ''} />
        {urlCount !== 0 && (
          <span
            className={`${
              urlCount > 9 ? 'text-xxxs' : 'text-xs'
            } text-gray dark:text-bright-gray font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
            title={`${urlCount} URL(s) have this known breakage.`}
          >
            {urlCount > 9 ? '9+' : urlCount}
          </span>
        )}
      </span>
      <p className="flex-1 dark:text-bright-gray font-medium">
        {title}
        {featuresText && (
          <span className="text-gray ml-2 dark:text-bright-gray">
            — {featuresText}
          </span>
        )}
      </p>
      <span className="flex items-center px-2 text-granite-gray dark:text-bright-gray">
        <ChevronDown
          className={classNames({
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
