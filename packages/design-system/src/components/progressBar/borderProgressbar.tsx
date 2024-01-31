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

interface BorderProgressBarProps {
  additionalStyles?: string;
}
const BorderProgressBar = ({
  additionalStyles = '',
}: BorderProgressBarProps) => {
  return (
    <div
      className={`${additionalStyles} flex justify-center flex-col gap-2 relative overflow-hidden mx-auto`}
    >
      <div className="h-px w-full bg-gainsboro dark:bg-neutral-600 overflow-hidden">
        <div className="h-px w-1/5 bg-royal-blue absolute animate-horizontal-spinner"></div>
      </div>
    </div>
  );
};

export default BorderProgressBar;
