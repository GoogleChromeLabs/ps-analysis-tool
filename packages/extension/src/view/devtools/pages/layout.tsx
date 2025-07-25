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
  Tick,
  Plus,
  ExternalLinkBlack,
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
import {
  CDP_WARNING_MESSAGE,
  RELOAD_WARNING_MESSAGE,
} from '../../../constants';
import { getCurrentTab } from '../../../utils/getCurrentTab';

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
    isUsingCDPForSettingsPageDisplay,
    setSettingsChanged,
    setIsUsingCDPForSettingsPageDisplay,
    incognitoAccess,
    openIncognitoTab,
  } = useSettings(({ state, actions }) => ({
    settingsChanged: state.settingsChanged,
    handleSettingsChange: actions.handleSettingsChange,
    exceedingLimitations: state.exceedingLimitations,
    setSettingsChanged: actions.setSettingsChanged,
    setIsUsingCDPForSettingsPageDisplay:
      actions.setIsUsingCDPForSettingsPageDisplay,
    isUsingCDPForSettingsPageDisplay: state.isUsingCDPForSettingsPageDisplay,
    incognitoAccess: state.incognitoAccess,
    openIncognitoTab: actions.openIncognitoTab,
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

      const cookiesMainItem =
        psData.children[SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES].children[
          SIDEBAR_ITEMS_KEYS.COOKIES
        ];

      if (cookiesMainItem) {
        cookiesMainItem.panel = {
          Element: Cookies as (props: any) => React.JSX.Element,
          props: { setFilteredCookies },
        };
        cookiesMainItem.children = Object.keys(
          tabFrames || {}
        ).reduce<SidebarItems>((acc, url) => {
          const popupTitle = I18n.getMessage('cookiesUsedByFrame', [url]);

          acc[url] = {
            title: url,
            popupTitle,
            panel: {
              Element: Cookies as (props: any) => React.JSX.Element,
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
        }, {});

        const showInspectButton =
          canStartInspecting && Boolean(Object.keys(tabFrames || {}).length);

        if (showInspectButton) {
          psData.children[SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES].children[
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
          psData.children[SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES].children[
            SIDEBAR_ITEMS_KEYS.COOKIES
          ].extraInterfaceToTitle = {};
        }
      }

      (async () => {
        const currentTab = await getCurrentTab();
        const isFirstVisit =
          (await chrome.storage.sync.get('isFirstTime'))?.isFirstTime ?? false;

        if (currentTab?.incognito) {
          delete data[SIDEBAR_ITEMS_KEYS.OPEN_INCOGNITO_TAB];
          data[SIDEBAR_ITEMS_KEYS.SETTINGS].addDivider = false;
          return;
        }
        data[SIDEBAR_ITEMS_KEYS.OPEN_INCOGNITO_TAB].containerClassName =
          incognitoAccess ? '' : 'disabled opacity-50';
        data[SIDEBAR_ITEMS_KEYS.OPEN_INCOGNITO_TAB].popupTitle = incognitoAccess
          ? 'Open in Incognito'
          : 'You will be redirected to the settings page, please enable incognito access for this extension.';

        if (data[SIDEBAR_ITEMS_KEYS.OPEN_INCOGNITO_TAB].panel) {
          data[SIDEBAR_ITEMS_KEYS.OPEN_INCOGNITO_TAB].panel.props = {
            onClick: openIncognitoTab,
          };
        }
        if (!isFirstVisit) {
          data[SIDEBAR_ITEMS_KEYS.OPEN_INCOGNITO_TAB].extraInterfaceToTitle = {
            Element: () => {
              return (
                <div
                  className="hover:cursor-pointer"
                  onClick={openIncognitoTab}
                >
                  <ExternalLinkBlack
                    className={`${
                      isSidebarFocused
                        ? 'dark:fill-bright-gray fill-bright-gray'
                        : 'dark:fill-bright-gray fill-granite-gray'
                    }`}
                    width="14"
                  />
                </div>
              );
            },
          };
        }
      })();

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
    incognitoAccess,
    openIncognitoTab,
  ]);

  const buttonReloadActionCompnent = useMemo(() => {
    return (
      <div className="flex items-center gap-5">
        <Button
          text={
            <>
              <Tick className="w-4 h-4 sm:hidden max-sm:block" />
              <span className="max-sm:hidden sm:block">Yes</span>
            </>
          }
          size="large"
          onClick={handleSettingsChange}
          variant="success"
        />
        <Button
          text={
            <>
              <Plus className="rotate-45 w-4 h-4 sm:hidden max-sm:block" />
              <span className="max-sm:hidden sm:block">No</span>
            </>
          }
          size="large"
          onClick={async () => {
            await chrome.storage.session.remove([
              'isUsingCDP',
              'pendingReload',
            ]);
            setSettingsChanged(false);
            setIsUsingCDPForSettingsPageDisplay(true);
          }}
        />
      </div>
    );
  }, [
    handleSettingsChange,
    setIsUsingCDPForSettingsPageDisplay,
    setSettingsChanged,
  ]);

  const isUsingCDPCondition = useMemo(
    () => isUsingCDPForSettingsPageDisplay,
    [isUsingCDPForSettingsPageDisplay]
  );

  const settingsReadActionComponent = useMemo(() => {
    return (
      <div className="flex items-center gap-5">
        <Button
          text={
            <>
              <Tick className="w-4 h-4 sm:hidden max-sm:block" />
              <span className="max-sm:hidden sm:block">Yes</span>
            </>
          }
          size="large"
          onClick={handleSettingsChange}
          variant={exceedingLimitations ? 'danger' : 'success'}
        />
        <Button
          text={
            <>
              <Plus className="rotate-45 w-4 h-4 sm:hidden max-sm:block" />
              <span className="max-sm:hidden sm:block">No</span>
            </>
          }
          size="large"
          onClick={async () => {
            await chrome.storage.session.remove([
              'isUsingCDP',
              'pendingReload',
            ]);
            setSettingsChanged(false);
            setIsUsingCDPForSettingsPageDisplay(false);
          }}
        />
      </div>
    );
  }, [
    exceedingLimitations,
    handleSettingsChange,
    setSettingsChanged,
    setIsUsingCDPForSettingsPageDisplay,
  ]);

  const formedToastMessage = useMemo(() => {
    let message = '';

    if (settingsChanged) {
      if (isUsingCDPCondition) {
        message = exceedingLimitations
          ? CDP_WARNING_MESSAGE
          : RELOAD_WARNING_MESSAGE;
        return (
          <ToastMessage
            additionalStyles="text-sm"
            text={message}
            actionComponent={settingsReadActionComponent}
            textAdditionalStyles="xxs:p-1 xxs:text-xxs sm:max-2xl:text-xsm leading-5 px-5"
          />
        );
      } else {
        message = RELOAD_WARNING_MESSAGE;
        return (
          <ToastMessage
            additionalStyles="text-sm"
            text={message}
            actionComponent={buttonReloadActionCompnent}
            textAdditionalStyles="xxs:p-1 xxs:text-xxs sm:max-2xl:text-xsm leading-5"
          />
        );
      }
    }
    return <></>;
  }, [
    buttonReloadActionCompnent,
    exceedingLimitations,
    isUsingCDPCondition,
    settingsChanged,
    settingsReadActionComponent,
  ]);

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
        SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES
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
        <main
          ref={mainRef}
          className={classNames('w-full flex-1 relative', {
            'overflow-hidden': selectedItemKey === 'privacy-sandbox',
            'overflow-auto': selectedItemKey !== 'privacy-sandbox',
          })}
        >
          <div className="w-full h-full">
            <div className={layoutWidth + ' h-full z-1'}>
              {PanelElement && <PanelElement {...props} />}
            </div>
          </div>
        </main>
        {formedToastMessage}
      </div>
    </div>
  );
};

export default Layout;
