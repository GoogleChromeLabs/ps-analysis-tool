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
 * External dependencies
 */
import { ToggleSwitch } from '@ps-analysis-tool/design-system';
import React, { type PropsWithChildren } from 'react';
import { useSettings } from '../../stateProviders';

const CookieLanding = ({ children }: PropsWithChildren) => {
  const { isUsingCDP, setUsingCDP } = useSettings(({ state, actions }) => ({
    isUsingCDP: state.isUsingCDP,
    setUsingCDP: actions.setUsingCDP,
  }));

  const cdpLabel = isUsingCDP ? 'Disable CDP' : 'Enable CDP';

  return (
    <div className="w-full h-full flex justify-center items-center flex-col z-1">
      <ToggleSwitch
        onLabel={cdpLabel}
        additionalStyles="top-2 left-2 absolute"
        setEnabled={setUsingCDP}
        enabled={isUsingCDP}
      />
      {children}
    </div>
  );
};

export default CookieLanding;
