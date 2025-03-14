/*
 * Copyright 2025 Google LLC
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

const borderColors: Record<string, string> = {
  'privacy-blue': 'border-privacy-blue',
  'privacy-green': 'border-privacy-green',
  'privacy-purple': 'border-privacy-purple',
};

const FrameContent = ({
  children,
  width = '100%',
  height = '100%',
  color = 'privacy-blue',
}: {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  color?: string;
}) => {
  const commonClassName = `${borderColors[color]} bg-white dark:bg-raisin-black absolute box-border w-full h-full border-[2px] rounded-xl col-start-1 row-start-1`;

  return (
    <div className="grid relative" style={{ width, height }}>
      {/* Bottom border (shadow) */}
      <div
        className={classNames(commonClassName, 'border-b-[18px] top-[13px]')}
      />
      {/* Content */}
      <div
        className={classNames(
          commonClassName,
          'flex items-center justify-center p-8'
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default FrameContent;
