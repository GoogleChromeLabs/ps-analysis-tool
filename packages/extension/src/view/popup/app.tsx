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
import React, { useMemo } from 'react';
import {
  Button,
  CirclePieChart,
  ProgressBar,
  ToastMessage,
  ToggleSwitch,
  prepareCookieStatsComponents,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import './app.css';
import { Legend } from './components';
import { useCookie, useSettings } from './stateProviders';

const App: React.FC = () => {
  const { cookieStats, loading, onChromeUrl } = useCookie(({ state }) => ({
    cookieStats: state.tabCookieStats,
    loading: state.loading,
    onChromeUrl: state.onChromeUrl,
  }));

  const { isUsingCDP, settingsChanged, setUsingCDP, handleSettingsChange } =
    useSettings(({ state, actions }) => ({
      isUsingCDP: state.isUsingCDPForSettingsDisplay,
      settingsChanged: state.settingsChanged,
      setUsingCDP: actions.setUsingCDP,
      handleSettingsChange: actions.handleSettingsChange,
    }));

  const cdpLabel = isUsingCDP
    ? I18n.getMessage('disableCDP')
    : I18n.getMessage('enableCDP');

  const actionComponent = useMemo(() => {
    return (
      <Button text="Reload" onClick={handleSettingsChange} variant="large" />
    );
  }, [handleSettingsChange]);

  if (onChromeUrl) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col z-1 text-center">
        <ToggleSwitch
          onLabel={cdpLabel}
          additionalStyles="top-2 left-2 absolute"
          setEnabled={setUsingCDP}
          enabled={isUsingCDP}
        />
        <p className="font-bold text-lg mb-2">
          {I18n.getMessage('noMoreAnalysis')}
        </p>
        <p className="text-chart-label text-xs">
          {I18n.getMessage('emptyCookieJar')}
        </p>
        <div className="absolute right-0 bottom-0 w-full">
          {settingsChanged && (
            <ToastMessage
              additionalStyles="text-sm"
              text={I18n.getMessage('settingsChanged')}
              actionComponent={actionComponent}
              textAdditionalStyles="xxs:p-1 text-xxs leading-5"
            />
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return <ProgressBar additionalStyles="w-96 min-h-[20rem]" />;
  }

  if (
    !cookieStats ||
    (cookieStats?.firstParty.total === 0 && cookieStats?.thirdParty.total === 0)
  ) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col z-1 text-center">
        <ToggleSwitch
          onLabel={cdpLabel}
          additionalStyles="top-2 left-2 absolute"
          setEnabled={setUsingCDP}
          enabled={isUsingCDP}
        />
        <p className="font-bold text-lg">{I18n.getMessage('noCookies')}</p>
        <p className="text-chart-label text-xs">
          {I18n.getMessage('tryReloading')}
        </p>
        <div className="absolute right-0 bottom-0 w-full">
          {settingsChanged && (
            <ToastMessage
              additionalStyles="text-sm"
              text={I18n.getMessage('settingsChanged')}
              actionComponent={actionComponent}
              textAdditionalStyles="xxs:p-1 text-xxs leading-5"
            />
          )}
        </div>
      </div>
    );
  }
  const statsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col z-1 text-center">
      <ToggleSwitch
        onLabel={cdpLabel}
        additionalStyles="top-2 left-2 absolute"
        setEnabled={setUsingCDP}
        enabled={isUsingCDP}
      />
      <div className="w-full flex gap-x-6 justify-center border-b border-hex-gray pb-3.5">
        <div className="w-32 text-center">
          <CirclePieChart
            centerCount={cookieStats.firstParty.total}
            data={statsComponents.firstParty}
            title={I18n.getMessage('firstPartyCookies')}
          />
        </div>
        <div className="w-32 text-center">
          <CirclePieChart
            centerCount={cookieStats.thirdParty.total}
            data={statsComponents.thirdParty}
            title={I18n.getMessage('thirdPartyCookies')}
          />
        </div>
      </div>
      <div className="w-full mb-4">
        <Legend legendItemList={statsComponents.legend} />
      </div>
      <div className="w-full text-center">
        <p className="text-chart-label text-xs">
          {I18n.getMessage('inspectInPSATPanel')}
        </p>
      </div>
      <div className="absolute right-0 bottom-0 w-full">
        {settingsChanged && (
          <ToastMessage
            additionalStyles="text-sm"
            text={I18n.getMessage('settingsChanged')}
            actionComponent={actionComponent}
            textAdditionalStyles="xxs:p-1 text-xxs leading-5"
          />
        )}
      </div>
    </div>
  );
};

export default App;
