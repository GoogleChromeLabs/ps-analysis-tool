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

interface LegendProps {
  scenarioTitle?: string;
  scenarioExplanation?: string;
  stepExplanation?: string;
}

const Legend = ({
  scenarioTitle,
  scenarioExplanation,
  stepExplanation,
}: LegendProps) => {
  return (
    <div className="p-3 text-[12.5px] dark:text-bright-gray h-full overflow-y-auto pb-5">
      {scenarioTitle && <h3 className="font-bold">{scenarioTitle}</h3>}
      {scenarioExplanation && <p>{scenarioExplanation}</p>}
      <hr className="my-2 border-gray-300 dark:border-bright-gray" />
      <p className="font-bold">Current Step:</p>
      {stepExplanation && <p>{stepExplanation}</p>}
    </div>
  );
};

export default Legend;
