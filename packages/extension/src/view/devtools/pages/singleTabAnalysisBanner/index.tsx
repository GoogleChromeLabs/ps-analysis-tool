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
 * External dependencies.
 */
import React, { memo } from 'react';
import { Button, ProgressBar } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import { useCookie, useSettings } from '../../stateProviders';
import useCanShowAnalyzeTabButton from '../../hooks/useCanShowAnalyzeTabButton';

interface CookiesProps {
  children: React.ReactNode;
  customMessaging?: React.ReactNode;
}

const SingleTabAnalysisBanner = ({
  children,
  customMessaging,
}: CookiesProps) => {
  const {
    isCurrentTabBeingListenedTo,
    loading,
    tabToRead,
    changeListeningToThisTab,
  } = useCookie(({ state, actions }) => ({
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    loading: state.loading,
    tabToRead: state.tabToRead,
    changeListeningToThisTab: actions.changeListeningToThisTab,
  }));
  const canShowAnalyzeTabButton = useCanShowAnalyzeTabButton();

  const { allowedNumberOfTabs } = useSettings(({ state }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
  }));

  if (
    loading ||
    (loading &&
      tabToRead &&
      isCurrentTabBeingListenedTo &&
      allowedNumberOfTabs &&
      allowedNumberOfTabs === 'single')
  ) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-raisin-black">
        <ProgressBar additionalStyles="w-full" />
      </div>
    );
  }

  if (canShowAnalyzeTabButton) {
    return children;
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {customMessaging ? (
          customMessaging
        ) : (
          <Button
            onClick={changeListeningToThisTab}
            text={I18n.getMessage('analyzeThisTab')}
          />
        )}
      </div>
    </div>
  );
};

export default memo(SingleTabAnalysisBanner);
