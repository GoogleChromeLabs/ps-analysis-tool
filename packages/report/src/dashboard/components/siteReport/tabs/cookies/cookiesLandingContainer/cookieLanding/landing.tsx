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
import { useMemo } from 'react';
import type { LibraryData, TabCookies, TabFrames } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import {
  type CookiesLandingSection,
  MenuBar,
  type MenuData,
} from '@google-psat/design-system';
/**
 * Internal dependencies.
 */
import CookiesSection from './cookiesSection';
import BlockedCookiesSection from './blockedCookiesSection';
import KnownBreakages from './knownBreakages';
import ExemptedCookiesSection from './exemptedCookiesSection';
import FramesSection from './framesSection';

interface LandingProps {
  tabFrames: TabFrames;
  tabCookies: TabCookies;
  cookiesWithIssues: TabCookies;
  downloadReport?: () => Promise<void>;
  libraryMatches: LibraryData | null;
  isSiteMapLandingContainer?: boolean;
  menuBarScrollContainerId?: string;
  libraryMatchesUrlCount?: {
    [url: string]: number;
  };
}

const Landing = ({
  tabFrames,
  tabCookies,
  cookiesWithIssues,
  downloadReport,
  libraryMatches,
  libraryMatchesUrlCount,
  menuBarScrollContainerId = 'dashboard-layout-container',
}: LandingProps) => {
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

    // @ts-ignore -- PSAT_USING_CDP is added only when the report is downloaded from the extension. Only false value to be considered.
    if (globalThis?.PSAT_USING_CDP !== false) {
      baseSections.splice(2, 0, {
        name: I18n.getMessage('exemptionReasons'),
        link: 'exemption-reasons',
        panel: {
          Element: ExemptedCookiesSection,
          props: {
            tabFrames,
            tabCookies,
          },
        },
      });
    }

    //@ts-ignore -- PSAT_EXTENSTION is added only when the report is downloaded from the extension. Since optional chaining is done it will return false if it doesnt exist.
    if (globalThis?.PSAT_EXTENSION) {
      baseSections.push({
        name: I18n.getMessage('frames'),
        link: 'frames',
        panel: {
          Element: FramesSection,
          props: {
            tabCookies,
            tabFrames,
          },
        },
      });
    }

    return baseSections;
  }, [
    cookiesWithIssues,
    libraryMatches,
    libraryMatchesUrlCount,
    tabCookies,
    tabFrames,
  ]);

  const menuData: MenuData = useMemo(
    () => sections.map(({ name, link }) => ({ name, link })),
    [sections]
  );

  return (
    <>
      <MenuBar
        disableReportDownload={false}
        downloadReport={
          // @ts-ignore -- PSAT_DATA is not present in globalThis type.
          globalThis?.PSAT_DATA?.hideDownloadButton ||
          Object.keys(tabCookies ?? {}).length === 0
            ? undefined
            : downloadReport
        }
        menuData={menuData}
        scrollContainerId={menuBarScrollContainerId}
        extraClasses="top-[85px]"
      />
      {sections.map(({ link, panel: { Element, props } }) => (
        <div id={link} key={link} className="cookie-landing-section">
          {Element && <Element {...(props || {})} />}
        </div>
      ))}
    </>
  );
};

export default Landing;
