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
 * External dependencies.
 */
import React from 'react';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import InspectButton from './inspectButton';

const TopBar = () => {
  const { isInspecting, setIsInspecting } = useCookieStore(
    ({ state, actions }) => ({
      setIsInspecting: actions.setIsInspecting,
      isInspecting: state.isInspecting,
    })
  );

  return (
    <div className="mini-status-bar w-full min-h-[25px] px-2 flex items-center border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green">
      <InspectButton
        setIsInspecting={setIsInspecting}
        isInspecting={isInspecting}
      />
    </div>
  );
};

export default TopBar;
