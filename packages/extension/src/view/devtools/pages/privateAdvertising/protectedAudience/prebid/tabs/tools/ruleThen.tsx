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
import {
  DeleteForever,
  Dropdown,
  Equal,
  Plus,
  type OptGroup,
} from '@google-psat/design-system';
import { useRef } from 'react';
/**
 * Internal dependencies
 */
import { replaceRuleTargets } from './constants';

interface RuleProps {
  ruleIndex: number;
  ruleKey: string;
  rule: PrebidDebugModuleConfigRule;
  addMatchRule: (
    ruleWhen: PrebidDebugModuleConfigRule['when'],
    ruleIndex: number
  ) => void;
  handleChange: (
    ruleKey: string,
    ruleIndex: number,
    newValue: any,
    _delete?: boolean
  ) => void;
  groupIndex: number;
}

const mediaTypes = replaceRuleTargets.reduce((acc, cur) => {
  if (!acc.find(({ label }) => label === cur.mediaType)) {
    acc.push({ label: cur.mediaType, options: [] });
  }

  const _labels =
    acc
      .find(({ label }) => label === cur.mediaType)
      ?.options?.map(({ label }) => label) ?? [];

  if (!_labels.includes(cur.label)) {
    acc.find(({ label }) => label === cur.mediaType)?.options.push(cur);
  } else {
    return acc;
  }

  return acc;
}, [] as OptGroup[]);

const RuleThen = ({
  ruleKey,
  rule,
  addMatchRule,
  handleChange,
  ruleIndex,
  groupIndex,
}: RuleProps) => {
  const dropdownRef = useRef<HTMLSelectElement | null>(null);

  return (
    <div className="flex flex-col gap-1">
      {groupIndex !== 0 && (
        <p className="text-raisin-black dark:text-bright-gray">and</p>
      )}
      <div className="flex flex-row gap-2 items-center gap-1">
        <div className="w-1/2">
          <Dropdown
            ref={dropdownRef}
            groups={mediaTypes}
            onChange={(value) => {
              handleChange(ruleKey, ruleIndex, '', true);
              handleChange(value, ruleIndex, '');
            }}
            value={ruleKey}
          />
        </div>
        <div className="w-4 h-4">
          <Equal className="w-4 h-4 text-raisin-black dark:text-bright-gray" />
        </div>
        <div className="w-1/2">
          {ruleKey === 'mediaType' ? (
            <Dropdown
              onChange={(value) => {
                handleChange(ruleKey, ruleIndex, value);
              }}
              options={replaceRuleTargets
                .find((target) => target.value === ruleKey)
                ?.options?.map((option) => ({ label: option, value: option }))}
              value={rule.then[ruleKey].toString()}
            />
          ) : (
            <></>
          )}
        </div>
        {Object.keys(rule.then).length > 1 && (
          <div
            className="w-4 h-4 cursor-pointer"
            onClick={() => handleChange(ruleKey, ruleIndex, null, true)}
          >
            <DeleteForever className="w-4 h-4 text-raisin-black dark:text-bright-gray" />
          </div>
        )}
        {Object.keys(rule.then).length < 5 && (
          <div
            className="w-4 h-4 cursor-pointer"
            onClick={() => addMatchRule(rule.when, ruleIndex)}
          >
            <Plus className="w-4 h-4 text-raisin-black dark:text-bright-gray" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleThen;
