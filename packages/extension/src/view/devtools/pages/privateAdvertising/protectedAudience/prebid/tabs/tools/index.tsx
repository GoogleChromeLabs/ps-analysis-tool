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
import { useCallback, useState } from 'react';
import { Button } from '@google-psat/design-system';
/**
 * Internal dependencies
 */
import { matchRuleTargets } from './constants';
import RuleWhen from './ruleWhen';

const Tools = () => {
  const [debuggingModuleConfig, setDebuggingModuleConfig] =
    useState<PrebidDebugModuleConfig>({
      enabled: false,
      intercept: [],
    });

  const addMatchRule = useCallback(
    (ruleWhen: PrebidDebugModuleConfigRule['when'], ruleIndex: number) => {
      const firstDifferent = (input: string[], excludes: string[]): string => {
        const [first] = input.filter((item) => !excludes?.includes(item));
        return first;
      };

      const newMatchRuleTarget = firstDifferent(
        matchRuleTargets.map(({ value }) => value),
        Object.keys(ruleWhen)
      );

      if (!newMatchRuleTarget) {
        return;
      }

      setDebuggingModuleConfig((prevState) => {
        const newState = structuredClone(prevState);
        newState.intercept[ruleIndex].when = {
          ...newState.intercept[ruleIndex].when,
          [newMatchRuleTarget]: '',
        };
        return newState;
      });
    },
    []
  );

  const changeWhenRule = useCallback(
    (ruleKey: string, ruleIndex: number, newValue: any, _delete = false) => {
      if (_delete) {
        setDebuggingModuleConfig((prevState) => {
          const newState = structuredClone(prevState);
          delete newState.intercept[ruleIndex].when[ruleKey];
          return newState;
        });
        return;
      }

      setDebuggingModuleConfig((prevState) => {
        const newState = structuredClone(prevState);
        newState.intercept[ruleIndex].when[ruleKey] = newValue;
        return newState;
      });
    },
    []
  );

  return (
    <div className="flex flex-col w-full h-full px-3 relative">
      <div className="flex flex-row w-full h-fit shadow-lg px-3 items-center">
        {debuggingModuleConfig.intercept.map((rule, ruleIndex) => {
          return (
            <>
              <div key={ruleIndex} className="w-1/2 flex flex-col gap-1">
                <p className="text-raisin-black dark:text-bright-gray">when</p>
                {Object.keys(rule.when).map((ruleKey, index) => {
                  return (
                    <RuleWhen
                      addMatchRule={addMatchRule}
                      handleChange={changeWhenRule}
                      key={index}
                      ruleKey={ruleKey}
                      rule={rule}
                      ruleIndex={ruleIndex}
                      options={matchRuleTargets}
                    />
                  );
                })}
              </div>
              <div className="w-1/2">
                <p className="text-raisin-black dark:text-bright-gray">then</p>
                {Object.keys(rule.then).map((ruleKey, index) => {
                  return (
                    <RuleWhen
                      addMatchRule={addMatchRule}
                      handleChange={changeWhenRule}
                      key={index}
                      ruleKey={ruleKey}
                      rule={rule}
                      ruleIndex={ruleIndex}
                      options={matchRuleTargets}
                    />
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button
          text="Add rule"
          onClick={() =>
            setDebuggingModuleConfig((prevState) => {
              return {
                ...prevState,
                intercept: [
                  ...prevState.intercept,
                  { when: { adUnitCode: '' }, then: { cpm: 20 } },
                ],
              };
            })
          }
        />
      </div>
    </div>
  );
};
export default Tools;
