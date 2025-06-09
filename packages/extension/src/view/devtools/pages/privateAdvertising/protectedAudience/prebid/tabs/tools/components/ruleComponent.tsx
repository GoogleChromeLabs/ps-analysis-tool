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
 * External dependencies
 */
import type {
  PrebidDebugModuleConfig,
  PrebidDebugModuleConfigRule,
} from '@google-psat/common';
import { DeleteForever } from '@google-psat/design-system';
import type { Dispatch, SetStateAction } from 'react';

/**
 * Internal dependencies
 */
import { matchRuleTargets } from '../../../../../../../stateProviders/prebid/constants';
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
  setDebuggingModuleConfig: Dispatch<SetStateAction<PrebidDebugModuleConfig>>;
}

const RuleComponent = ({
  changeRule,
  addRule,
  ruleIndex,
  rule,
  setDebuggingModuleConfig,
}: RuleComponentProps) => {
  return (
    <div
      className="flex flex-col w-full h-fit items-start gap-4"
      key={ruleIndex}
    >
      <div className="w-full flex justify-between">
        <span className="text-base font-bold text-raisin-black dark:text-bright-gray">
          Rule #{ruleIndex + 1}
        </span>
        <div
          title="Delete Rule"
          className="w-4 h-4 cursor-pointer"
          onClick={() =>
            setDebuggingModuleConfig((prevState) => {
              const newState = structuredClone(prevState);
              newState.intercept = newState.intercept.filter(
                (_, index) => index !== ruleIndex
              );
              return newState;
            })
          }
        >
          <DeleteForever className="w-6 h-5 text-raisin-black dark:text-bright-gray" />
        </div>
      </div>
      <div
        className="flex flex-row w-full h-fit items-start gap-10"
        key={ruleIndex}
      >
        <div key={ruleIndex} className="w-1/2 flex flex-col gap-2 mx-4">
          <p className="text-sm font-bold text-raisin-black dark:text-bright-gray">
            when
          </p>
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
        <div className="w-1/2 flex flex-col gap-2 mx-4">
          <p className="text-sm font-bold text-raisin-black dark:text-bright-gray">
            then
          </p>
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
    </div>
  );
};
export default RuleComponent;
