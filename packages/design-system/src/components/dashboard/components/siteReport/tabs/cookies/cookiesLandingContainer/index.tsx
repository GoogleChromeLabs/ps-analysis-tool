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
import type { LibraryData, TabCookies, TabFrames } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import CookiesSection from './cookieLanding/cookiesSection';
import BlockedCookiesSection from './cookieLanding/blockedCookiesSection';
import KnownBreakages from './cookieLanding/knownBreakages';
import ExemptedCookiesSection from './cookieLanding/exemptedCookiesSection';
import { prepareCookiesCount } from '../../../../../../../utils';
import MenuBar, { type MenuData } from '../../../../../../menuBar';
import CookiesLanding, {
  type CookiesLandingSection,
} from '../../../../../../cookiesLanding';
import FramesSection from './cookieLanding/framesSection';

interface CookiesLandingContainerProps {
  tabFrames: TabFrames;
  tabCookies: TabCookies;
  cookiesWithIssues: TabCookies;
  downloadReport?: () => void;
  libraryMatches: LibraryData | null;
  libraryMatchesUrlCount?: {
    [url: string]: number;
  };
  isSiteMapLandingContainer?: boolean;
  menuBarScrollContainerId?: string;
}

const CookiesLandingContainer = ({
  tabFrames,
  tabCookies,
  cookiesWithIssues,
  downloadReport,
  libraryMatches,
  libraryMatchesUrlCount,
  menuBarScrollContainerId = 'dashboard-layout-container',
}: CookiesLandingContainerProps) => {
  const cookieStats = prepareCookiesCount(tabCookies);

  const sections: Array<CookiesLandingSection> = useMemo(() => {
    const baseSections: Array<CookiesLandingSection> = [
      {
        name: I18n.getMessage('cookies'),
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
        name: I18n.getMessage('blockedCookies'),
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
      {
        name: 'Exempted Cookies',
        link: 'exempted-cookies',
        panel: {
          Element: ExemptedCookiesSection,
          props: {
            cookieStats,
            tabFrames,
          },
        },
      },
      {
        name: I18n.getMessage('knownBreakages'),
        link: 'known-breakages',
        panel: {
          Element: KnownBreakages,
          props: {
            libraryMatches: libraryMatches ?? {},
            libraryMatchesUrlCount,
          },
        },
      },
    ];
    //@ts-ignore
    if (globalThis?.PSAT_EXTENSION) {
      baseSections.push({
        name: I18n.getMessage('frames'),
        link: 'frames',
        panel: {
          Element: FramesSection,
        },
      });
    }

    return baseSections;
  }, [
    tabCookies,
    tabFrames,
    cookiesWithIssues,
    cookieStats,
    libraryMatches,
    libraryMatchesUrlCount,
  ]);

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
          scrollContainerId={menuBarScrollContainerId}
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
