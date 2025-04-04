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
  PaddedCross,
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

  const {
    settingsChanged,
    handleSettingsChange,
    exceedingLimitations,
    isUsingCDP,
    hasWarningBeenShown,
    setHasWarningBeenShown,
    setUsingCDP,
    isUsingCDPForSettingsPageDisplay,
  } = useSettings(({ state, actions }) => ({
    settingsChanged: state.settingsChanged,
    handleSettingsChange: actions.handleSettingsChange,
    exceedingLimitations: state.exceedingLimitations,
    isUsingCDP: state.isUsingCDP,
    hasWarningBeenShown: state.hasWarningBeenShown,
    setHasWarningBeenShown: actions.setHasWarningBeenShown,
    setUsingCDP: actions.setUsingCDP,
    isUsingCDPForSettingsPageDisplay: state.isUsingCDPForSettingsDisplay,
  }));

  const isUsingCDPCondition = useMemo(() => {
    if (isUsingCDP) {
      if (isUsingCDPForSettingsPageDisplay) {
        return true;
      } else {
        return false;
      }
    }
    if (!isUsingCDP) {
      if (isUsingCDPForSettingsPageDisplay) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }, [isUsingCDP, isUsingCDPForSettingsPageDisplay]);

  const cdpLabel = isUsingCDP
    ? I18n.getMessage('disableCDP')
    : I18n.getMessage('enableCDP');

  const buttonReloadActionCompnent = useMemo(() => {
    return (
      <Button text={'Reload'} onClick={handleSettingsChange} variant="large" />
    );
  }, [handleSettingsChange]);

  const settingsReadActionComponent = useMemo(() => {
    return (
      <div
        className="w-14 h-14 flex items-center cursor-pointer"
        onClick={() => {
          chrome.storage.session.set({ readSettings: true });
          setHasWarningBeenShown(true);
        }}
      >
        <PaddedCross className="w-4 h-4" />
      </div>
    );
  }, [setHasWarningBeenShown]);

  const performanceWarningToast = useMemo(() => {
    if (!hasWarningBeenShown && exceedingLimitations && isUsingCDPCondition) {
      return (
        <div
          className={`h-fit w-full relative z-10 ${
            isUsingCDPForSettingsPageDisplay
              ? 'border-t dark:border-quartz border-american-silver'
              : ''
          }`}
        >
          <ToastMessage
            isPopup={true}
            additionalStyles="text-sm"
            text="PSAT works best with a maximum of 5 tabs. Using more may impact the tool’s responsiveness."
            actionComponent={settingsReadActionComponent}
            textAdditionalStyles="xxs:p-1 xxs:text-xxs sm:max-2xl:text-xsm leading-5"
          />
        </div>
      );
    }
    return <></>;
  }, [
    exceedingLimitations,
    hasWarningBeenShown,
    isUsingCDPCondition,
    isUsingCDPForSettingsPageDisplay,
    settingsReadActionComponent,
  ]);

  const settingsWarningToast = useMemo(() => {
    if (settingsChanged) {
      return (
        <ToastMessage
          additionalStyles="text-sm"
          text={I18n.getMessage('settingsChanged')}
          actionComponent={buttonReloadActionCompnent}
          textAdditionalStyles="xxs:p-1 text-xxs leading-5"
        />
      );
    }
    return <></>;
  }, [settingsChanged, buttonReloadActionCompnent]);

  if (onChromeUrl) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col z-1 text-center">
        <ToggleSwitch
          onLabel={cdpLabel}
          additionalStyles="top-2 left-2 absolute"
          setEnabled={setUsingCDP}
          enabled={isUsingCDPForSettingsPageDisplay}
        />
        <p className="font-bold text-lg mb-2">
          {I18n.getMessage('noMoreAnalysis')}
        </p>
        <p className="text-chart-label text-xs">
          {I18n.getMessage('emptyCookieJar')}
        </p>
        <div className="absolute right-0 bottom-0 w-full">
          {settingsWarningToast}
          {performanceWarningToast}
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
          enabled={isUsingCDPForSettingsPageDisplay}
        />
        <p className="font-bold text-lg">{I18n.getMessage('noCookies')}</p>
        <p className="text-chart-label text-xs">
          {I18n.getMessage('tryReloading')}
        </p>
        <div className="absolute right-0 bottom-0 w-full">
          {settingsWarningToast}
          {performanceWarningToast}
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
        enabled={isUsingCDPForSettingsPageDisplay}
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
        {settingsWarningToast}
        {performanceWarningToast}
      </div>
    </div>
  );
};

export default App;
