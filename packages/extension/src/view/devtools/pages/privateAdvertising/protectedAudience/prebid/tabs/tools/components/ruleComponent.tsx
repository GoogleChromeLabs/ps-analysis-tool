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
import { matchRuleTargets } from '../constants';
import RuleWhen from './ruleWhen';
import RuleThen from './ruleThen';

interface RuleComponentProps {
  changeRule: (
    ruleKey: string,
    ruleType: 'when' | 'then',
    ruleIndex: number,
    newValue: any,
    _delete?: boolean
  ) => void;
  addRule: (
    ruleWhen: PrebidDebugModuleConfigRule,
    ruleType: 'when' | 'then',
    ruleIndex: number
  ) => void;
  ruleIndex: number;
  rule: PrebidDebugModuleConfigRule;
}

const RuleComponent = ({
  changeRule,
  addRule,
  ruleIndex,
  rule,
}: RuleComponentProps) => {
  return (
    <div
      className="flex flex-row w-full h-fit items-start mt-6"
      key={ruleIndex}
    >
      <div key={ruleIndex} className="w-1/2 flex flex-col gap-1">
        <p className="text-raisin-black dark:text-bright-gray">when</p>
        {Object.keys(rule.when).map((ruleKey, index) => {
          return (
            <RuleWhen
              addMatchRule={addRule}
              handleChange={changeRule}
              key={index}
              ruleKey={ruleKey}
              rule={rule}
              groupIndex={index}
              ruleIndex={ruleIndex}
              options={matchRuleTargets}
            />
          );
        })}
      </div>
      <div className="w-1/2 flex flex-col gap-1">
        <p className="text-raisin-black dark:text-bright-gray">then</p>
        {Object.keys(rule.then).map((ruleKey, index) => {
          return (
            <RuleThen
              addMatchRule={addRule}
              handleChange={changeRule}
              key={index}
              groupIndex={index}
              ruleKey={ruleKey}
              rule={rule}
              ruleIndex={ruleIndex}
            />
          );
        })}
      </div>
    </div>
  );
};
export default RuleComponent;
