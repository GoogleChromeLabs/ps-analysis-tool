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
  CookiesLanding,
  MenuBar,
  type CookiesLandingSection,
  type MenuData,
} from '@ps-analysis-tool/design-system';
import type { TabCookies, TabFrames } from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import CookiesSection from './cookieLanding/cookiesSection';
import BlockedCookiesSection from './cookieLanding/blockedCookiesSection';

interface CookiesLandingContainerProps {
  tabFrames: TabFrames;
  tabCookies: TabCookies;
  cookiesWithIssues: TabCookies;
  downloadReport?: () => void;
}

const CookiesLandingContainer = ({
  tabFrames,
  tabCookies,
  cookiesWithIssues,
  downloadReport,
}: CookiesLandingContainerProps) => {
  const sections: Array<CookiesLandingSection> = useMemo(
    () => [
      {
        name: I18n.getMessage('cdCookies'),
        link: 'cookies',
        panel: {
          Element: CookiesSection,
          props: {
            tabCookies,
            tabFrames,
          },
        },
      },
      {
        name: I18n.getMessage('cdBlockedCookies'),
        link: 'blocked-cookies',
        panel: {
          Element: BlockedCookiesSection,
          props: {
            tabCookies,
            cookiesWithIssues,
            tabFrames,
          },
        },
      },
    ],
    [tabCookies, tabFrames, cookiesWithIssues]
  );

  const menuData: MenuData = useMemo(
    () => sections.map(({ name, link }) => ({ name, link })),
    [sections]
  );

  return (
    <>
      <CookiesLanding>
        <MenuBar
          disableReportDownload={false}
          downloadReport={downloadReport}
          menuData={menuData}
          extraClasses="top-20"
          scrollContainerId="dashboard-layout-container"
        />
        {sections.map(({ link, panel: { Element, props } }) => (
          <div id={link} key={link} className="cookie-landing-section">
            {Element && <Element {...(props || {})} />}
          </div>
        ))}
      </CookiesLanding>
    </>
  );
};

export default CookiesLandingContainer;
