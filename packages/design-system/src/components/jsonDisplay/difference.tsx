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
import React from 'react';
import type {
  SourcesRegistration,
  TriggerRegistration,
} from '@google-psat/common';
import { detailedDiff } from 'deep-object-diff';
import JsonView from '../jsonView';

interface DifferenceProps {
  currentJson: TriggerRegistration | SourcesRegistration | null;
  prevJson: TriggerRegistration | SourcesRegistration | null;
}

const Difference = ({ currentJson, prevJson }: DifferenceProps) => {
  if (currentJson && prevJson) {
    return <JsonView src={detailedDiff(currentJson, prevJson)} />;
  }

  return (
    <div className="h-full p-8 flex items-center">
      <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
        Select a row such that it has a row above it to see the difference.
      </p>
    </div>
  );
};

export default Difference;
