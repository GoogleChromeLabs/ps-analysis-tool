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
} from '@google-psat/design-system';
import { useRef } from 'react';
/**
 * Internal dependencies
 */
import { useProtectedAudience } from '../../../../../../../stateProviders';
import { matchRuleTargets } from '../constants';

interface RuleProps {
  options: { label: string; value: string }[];
  ruleIndex: number;
  ruleKey: string;
  rule: PrebidDebugModuleConfigRule;
  addMatchRule: (
    ruleWhen: PrebidDebugModuleConfigRule,
    ruleType: 'when' | 'then',
    ruleIndex: number
  ) => void;
  handleChange: (
    ruleKey: string,
    ruleType: 'when' | 'then',
    ruleIndex: number,
    newValue: any,
    _delete?: boolean
  ) => void;
  groupIndex: number;
}

const RuleWhen = ({
  options,
  ruleKey,
  rule,
  addMatchRule,
  handleChange,
  ruleIndex,
  groupIndex,
}: RuleProps) => {
  const dropdownRef = useRef<HTMLSelectElement | null>(null);
  const ruleValueOptions = useProtectedAudience(({ state }) => {
    const prebidAdunits = Object.values(state.prebidResponse.adUnits);

    const _bidders = prebidAdunits.reduce((prev, adUnit) => {
      const newBidders = adUnit.bidders?.reduce((prevValue, bidder) => {
        if (!bidder) {
          return prevValue;
        }

        return Array.from(new Set([...prevValue, bidder]));
      }, [] as string[]);

      return Array.from(new Set([...prev, ...newBidders]));
    }, [] as string[]);

    return {
      adUnitCode: Object.keys(state.prebidResponse.adUnits),
      bidder: _bidders,
    };
  });
  return (
    <div className="flex flex-col gap-1">
      {groupIndex !== 0 && (
        <p className="text-raisin-black dark:text-bright-gray">and</p>
      )}
      <div className="flex flex-row gap-2 items-center gap-1">
        <div className="w-1/2">
          <Dropdown
            ref={dropdownRef}
            options={options}
            onChange={(value) => {
              handleChange(ruleKey, 'when', ruleIndex, '', true);
              handleChange(value, 'when', ruleIndex, '');
            }}
            value={ruleKey}
          />
        </div>
        <div className="w-4 h-4">
          <Equal className="w-4 h-4 text-raisin-black dark:text-bright-gray" />
        </div>
        <div className="w-1/2">
          <Dropdown
            onChange={(value) => {
              handleChange(ruleKey, 'when', ruleIndex, value);
            }}
            options={ruleValueOptions[
              ruleKey as keyof typeof ruleValueOptions
            ].map((adUnit) => ({
              label: adUnit,
              value: adUnit,
            }))}
            value={rule.when[ruleKey].toString()}
          />
        </div>
        {Object.keys(rule.when).length > 1 && (
          <div
            className="w-4 h-4 cursor-pointer"
            onClick={() => handleChange(ruleKey, 'when', ruleIndex, null, true)}
          >
            <DeleteForever className="w-4 h-4 text-raisin-black dark:text-bright-gray" />
          </div>
        )}
        {Object.keys(rule.when).length < matchRuleTargets.length && (
          <div
            className="w-4 h-4 cursor-pointer"
            onClick={() => addMatchRule(rule, 'when', ruleIndex)}
          >
            <Plus className="w-4 h-4 text-raisin-black dark:text-bright-gray" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleWhen;
