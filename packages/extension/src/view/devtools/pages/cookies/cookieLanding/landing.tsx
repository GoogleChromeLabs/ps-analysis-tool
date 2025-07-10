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
import React, { useCallback, useMemo } from 'react';
import {
  MenuBar,
  MessageBox,
  type CookiesLandingSection,
  type MenuData,
  type TableFilter,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import type { TabCookies } from '@google-psat/common';

/**
 * Internal dependencies
 */
import CookiesSection from './cookiesSection';
import FramesSection from './framesSection';
import BlockedCookiesSection from './blockedCookiesSection';
import { useCookie, useSettings } from '../../../stateProviders';
import downloadReport from '../../../../../utils/downloadReport';
import ExemptedCookiesSection from './exemptedCookiesSection';

interface LandingProps {
  tabCookies: TabCookies;
  appliedFilters: TableFilter;
}

const Landing = ({ tabCookies, appliedFilters }: LandingProps) => {
  const { unfilteredCookies, url, tabFrames } = useCookie(({ state }) => ({
    unfilteredCookies: state.tabCookies,
    tabFrames: state.tabFrames,
    url: state.tabUrl,
  }));

  const isUsingCDP = useSettings(({ state }) => state.isUsingCDP);

  const sections: Array<CookiesLandingSection> = useMemo(() => {
    const defaultSections: CookiesLandingSection[] = [
      {
        name: I18n.getMessage('cookies'),
        link: 'cookies',
        panel: {
          Element: CookiesSection,
          props: {
            tabCookies,
          },
        },
      },
      {
        name: I18n.getMessage('blockedCookies'),
        link: 'blocked-cookies',
        panel: {
          Element: BlockedCookiesSection,
          props: {
            tabCookies,
          },
        },
      },
      {
        name: I18n.getMessage('frames'),
        link: 'frames',
        panel: {
          Element: FramesSection,
          props: {
            tabCookies,
          },
        },
      },
    ];

    if (isUsingCDP) {
      defaultSections.splice(2, 0, {
        name: I18n.getMessage('exemptionReasons'),
        link: 'exemption-reasons',
        panel: {
          Element: ExemptedCookiesSection,
          props: {
            tabCookies,
          },
        },
      });
    }

    return defaultSections;
  }, [isUsingCDP, tabCookies]);

  const menuData: MenuData = useMemo(
    () => sections.map(({ name, link }) => ({ name, link })),
    [sections]
  );

  const _downloadReport = useCallback(async () => {
    await downloadReport(
      url || '',
      unfilteredCookies || {},
      tabFrames || {},
      appliedFilters,
      isUsingCDP
    );
  }, [appliedFilters, isUsingCDP, tabFrames, unfilteredCookies, url]);

  if (Object.keys(unfilteredCookies ?? {}).length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <MessageBox
          additionalClasses="flex items-center justify-center flex-col"
          width="w-full"
          bodyTextClass="text-sm"
          headerTextClass="text-lg"
          headerText={I18n.getMessage('noCookies')}
          bodyText={I18n.getMessage('tryReloading')}
        />
      </div>
    );
  }

  return (
    <div>
      <MenuBar
        disableReportDownload={false}
        downloadReport={_downloadReport}
        menuData={menuData}
        scrollContainerId="cookies-landing-scroll-container"
      />
      {sections.map(({ link, panel: { Element, props } }) => (
        <div id={link} key={link} className="cookie-landing-section">
          {Element && <Element {...props} />}
        </div>
      ))}
    </div>
  );
};
export default Landing;
