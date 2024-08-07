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
 * Internal dependencies.
 */
import type { DetectedSignature } from '../../types';

interface FeatureListProps {
  matches: DetectedSignature[];
}

const FeatureList = ({ matches }: FeatureListProps) => {
  if (!matches.length) {
    return null;
  }

  return (
    <ul className="mt-2 list-disc pl-3 dark:text-bright-gray">
      {matches.map(({ feature }) => {
        if (feature.type !== 'link') {
          return null;
        }

        return (
          <li key={feature.text}>
            <a
              className="text-bright-navy-blue dark:text-jordy-blue"
              target="_blank"
              href={feature.url}
              rel="noreferrer"
            >
              {feature.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default FeatureList;
