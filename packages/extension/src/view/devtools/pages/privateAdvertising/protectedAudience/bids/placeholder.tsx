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
 * Internal dependencies.
 */
import EvaluationEnvironment from '../evaluationEnvironment';

interface PlaceholderProps {
  showEvaluationPlaceholder: boolean | undefined;
}

const Placeholder = ({ showEvaluationPlaceholder }: PlaceholderProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-lg text-raisin-black dark:text-bright-gray">
        No bids data was recorded.
      </p>
      {showEvaluationPlaceholder && (
        <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the bids if you haven’t already." />
      )}
    </div>
  );
};

export default Placeholder;
