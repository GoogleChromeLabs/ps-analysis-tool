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
 * Internal dependencies
 */
import type { StatItem } from './types';

type GlossaryProps = {
  statItems: StatItem[];
};

const Glossary = ({ statItems }: GlossaryProps) => {
  return (
    <div>
      <div className="flex flex-col gap-2 p-2">
        {statItems.map((item) => (
          <div className="flex flex-row items-center gap-1" key={item.title}>
            <div
              className="w-2.5 shrink-0 h-2.5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-semibold">{item.title}:</span>
            <span>{item.glossaryText}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Glossary;
