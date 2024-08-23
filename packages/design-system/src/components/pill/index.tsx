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

interface PillProps {
  title: string;
}

const Pill = ({ title }: PillProps) => {
  return (
    <div className="h-5 p-2 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz rounded-full">
      {title}
    </div>
  );
};

export default Pill;