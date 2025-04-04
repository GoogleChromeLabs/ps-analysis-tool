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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type CookieTableData,
  updateSessionStorage,
} from '@google-psat/common';
import {
  Sidebar,
  useSidebar,
  type SidebarItems,
  CookieIconWhite,
  CookieIcon,
  InspectButton,
  ToastMessage,
  SIDEBAR_ITEMS_KEYS,
  Button,
  PaddedCross,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import { I18n } from '@google-psat/i18n';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import Cookies from './cookies';
import useFrameOverlay from '../hooks/useFrameOverlay';
import {
  useCookie,
  useProtectedAudience,
  useSettings,
} from '../stateProviders';

interface LayoutProps {
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
}

const Layout = ({ setSidebarData }: LayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const mainRef = useRef<HTMLElement>(null);

  const { selectedAdUnit } = useProtectedAudience(({ state }) => ({
    selectedAdUnit: state.selectedAdUnit,
  }));

  const {
    settingsChanged,
    handleSettingsChange,
    exceedingLimitations,
    isUsingCDP,
    hasWarningBeenShown,
    setHasWarningBeenShown,
    isUsingCDPForSettingsPageDisplay,
  } = useSettings(({ state, actions }) => ({
    settingsChanged: state.settingsChanged,
    handleSettingsChange: actions.handleSettingsChange,
    exceedingLimitations: state.exceedingLimitations,
    isUsingCDP: state.isUsingCDP,
    hasWarningBeenShown: state.hasWarningBeenShown,
    setHasWarningBeenShown: actions.setHasWarningBeenShown,
    isUsingCDPForSettingsPageDisplay: state.isUsingCDPForSettingsPageDisplay,
  }));

  const {
    tabFrames,
    frameHasCookies,
    canStartInspecting,
    isInspecting,
    setIsInspecting,
    setSelectedFrame,
  } = useCookie(({ state, actions }) => ({
    tabFrames: state.tabFrames,
    frameHasCookies: state.frameHasCookies,
    canStartInspecting: state.canStartInspecting,
    tabUrl: state.tabUrl,
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
    selectedFrame: state.selectedFrame,
    setSelectedFrame: actions.setSelectedFrame,
  }));

  const {
    activePanel,
    selectedItemKey,
    currentItemKey,
    isSidebarFocused,
    updateSelectedItemKey,
    isKeySelected,
    isCollapsed,
    sidebarItems,
  } = useSidebar(({ state, actions }) => ({
    activePanel: state.activePanel,
    selectedItemKey: state.selectedItemKey,
    currentItemKey: state.currentItemKey,
    isSidebarFocused: state.isSidebarFocused,
    updateSelectedItemKey: actions.updateSelectedItemKey,
    isKeySelected: actions.isKeySelected,
    isCollapsed: state.isCollapsed,
    sidebarItems: state.sidebarItems,
  }));

  const { Element: PanelElement, props } = activePanel.panel;

  useEffect(() => {
    setSidebarData((prev) => {
      const data = { ...prev };
      const psData = data[SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX];

      psData.children[SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING].children[
        SIDEBAR_ITEMS_KEYS.COOKIES
      ].panel = {
        Element: Cookies,
        props: { setFilteredCookies },
      };
      psData.children[SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING].children[
        SIDEBAR_ITEMS_KEYS.COOKIES
      ].children = Object.keys(tabFrames || {}).reduce<SidebarItems>(
        (acc, url) => {
          const popupTitle = I18n.getMessage('cookiesUsedByFrame', [url]);

          acc[url] = {
            title: url,
            popupTitle,
            panel: {
              Element: Cookies,
              props: { setFilteredCookies },
            },
            icon: {
              Element: CookieIcon,
            },
            selectedIcon: {
              Element: CookieIconWhite,
            },
            children: {},
            isBlurred: !frameHasCookies?.[url],
          };

          return acc;
        },
        {}
      );

      const showInspectButton =
        canStartInspecting && Boolean(Object.keys(tabFrames || {}).length);

      if (showInspectButton) {
        psData.children[SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING].children[
          SIDEBAR_ITEMS_KEYS.COOKIES
        ].extraInterfaceToTitle = {
          Element: InspectButton,
          props: {
            isInspecting,
            selectedAdUnit,
            setIsInspecting,
            isTabFocused:
              isSidebarFocused && isKeySelected(SIDEBAR_ITEMS_KEYS.COOKIES),
          },
        };
      } else {
        psData.children[SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING].children[
          SIDEBAR_ITEMS_KEYS.COOKIES
        ].extraInterfaceToTitle = {};
      }

      return data;
    });
  }, [
    selectedAdUnit,
    canStartInspecting,
    frameHasCookies,
    isInspecting,
    isKeySelected,
    isSidebarFocused,
    setIsInspecting,
    setSidebarData,
    tabFrames,
  ]);

  const buttonReloadActionCompnent = useMemo(() => {
    return (
      <Button text={'Reload'} onClick={handleSettingsChange} variant="large" />
    );
  }, [handleSettingsChange]);

  const settingsReadActionComponent = useMemo(() => {
    return (
      <div
        className="w-14 h-14 flex items-center"
        onClick={() => {
          chrome.storage.session.set({ readSettings: true });
          setHasWarningBeenShown(true);
        }}
      >
        <PaddedCross className="w-4 h-4" />
      </div>
    );
  }, [setHasWarningBeenShown]);

  useEffect(() => {
    if (Object.keys(tabFrames || {}).includes(currentItemKey || '')) {
      setSelectedFrame(currentItemKey);
    } else {
      setSelectedFrame(null);
    }
  }, [currentItemKey, setSelectedFrame, tabFrames]);

  const cookieDropdownOpen = useMemo(() => {
    return (
      sidebarItems[SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX]?.children[
        SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING
      ]?.children?.[SIDEBAR_ITEMS_KEYS.COOKIES]?.dropdownOpen ?? false
    );
  }, [sidebarItems]);

  useEffect(() => {
    (async () => {
      await updateSessionStorage(
        {
          selectedSidebarItem: selectedItemKey,
          sidebarCollapsedState: isCollapsed,
          cookieDropdownOpen: cookieDropdownOpen,
        },
        'persistentSetting'
      );
    })();
  }, [selectedItemKey, isCollapsed, cookieDropdownOpen]);

  const [filteredCookies, setFilteredCookies] = useState<CookieTableData[]>([]);

  const handleUpdate = useCallback(
    (key: string | null) => {
      updateSelectedItemKey(key || SIDEBAR_ITEMS_KEYS.COOKIES);
    },
    [updateSelectedItemKey]
  );

  useFrameOverlay(filteredCookies, handleUpdate);

  useEffect(() => {
    if (isCollapsed) {
      setSidebarWidth(40);
    } else {
      setSidebarWidth(200);
    }
  }, [isCollapsed]);

  useEffect(() => {
    mainRef.current?.scrollTo({
      top: 0,
      left: 0,
    });
  }, [PanelElement]);

  const [allowTransition, setAllowTransition] = useState(true);

  const layoutWidth = selectedItemKey?.startsWith('learning')
    ? 'min-w-[400px]'
    : 'min-w-[50rem]';

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

  return (
    <div className="w-full h-full flex flex-row z-1">
      <Resizable
        size={{ width: sidebarWidth, height: '100%' }}
        defaultSize={{ width: '200px', height: '100%' }}
        onResizeStart={() => {
          setAllowTransition(false);
        }}
        onResizeStop={(_, __, ___, d) => {
          setSidebarWidth((prevState) => prevState + d.width);
          setAllowTransition(true);
        }}
        minWidth={isCollapsed ? 40 : 160}
        maxWidth={'90%'}
        enable={{
          right: !isCollapsed,
        }}
        className={classNames('h-full', {
          'transition-all duration-300': allowTransition,
        })}
      >
        <Sidebar visibleWidth={sidebarWidth} />
      </Resizable>
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        <main ref={mainRef} className="w-full flex-1 relative overflow-auto">
          <div className="w-full h-full">
            <div className={layoutWidth + ' h-full z-1'}>
              {PanelElement && <PanelElement {...props} />}
            </div>
          </div>
        </main>
        {settingsChanged && (
          <div className="h-fit w-full relative z-10">
            <ToastMessage
              additionalStyles="text-sm"
              text={I18n.getMessage('settingsChanged')}
              actionComponent={buttonReloadActionCompnent}
              textAdditionalStyles="xxs:p-1 xxs:text-xxs sm:max-2xl:text-xsm leading-5"
            />
          </div>
        )}
        {!hasWarningBeenShown &&
          exceedingLimitations &&
          isUsingCDPCondition && (
            <div
              className={`h-fit w-full relative z-10 cursor-pointer ${
                isUsingCDPForSettingsPageDisplay
                  ? 'border-t dark:border-quartz border-american-silver'
                  : ''
              }`}
            >
              <ToastMessage
                additionalStyles="text-sm"
                text="PSAT works best with a maximum of 5 tabs. Using more may impact the tool’s responsiveness."
                actionComponent={settingsReadActionComponent}
                textAdditionalStyles="xxs:p-1 xxs:text-xxs sm:max-2xl:text-xsm leading-5"
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default Layout;
