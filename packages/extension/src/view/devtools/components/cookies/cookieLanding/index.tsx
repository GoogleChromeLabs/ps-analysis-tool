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
import React, { useMemo } from 'react';
import {
  LibraryDetection,
  useLibraryDetectionContext,
} from '@google-psat/library-detection';
import {
  MenuBar,
  type CookiesLandingSection,
  type MenuData,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import CookiesSection from './cookiesSection';
import FramesSection from './framesSection';
import BlockedCookiesSection from './blockedCookiesSection';
import { useCookie, useSettings } from '../../../stateProviders';
import downloadReport from '../../../../../utils/downloadReport';
import ExemptedCookiesSection from './exemptedCookiesSection';

const AssembledCookiesLanding = () => {
  const { url, tabCookies, tabFrames } = useCookie(({ state }) => ({
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
    url: state.tabUrl,
  }));

  const isUsingCDP = useSettings(({ state }) => state.isUsingCDP);

  const { libraryMatches, showLoader } = useLibraryDetectionContext(
    ({ state }) => ({
      libraryMatches: state.libraryMatches,
      showLoader: state.showLoader,
    })
  );

  const sections: Array<CookiesLandingSection> = useMemo(() => {
    const defaultSections = [
      {
        name: I18n.getMessage('cookies'),
        link: 'cookies',
        panel: {
          Element: CookiesSection,
        },
      },
      {
        name: I18n.getMessage('blockedCookies'),
        link: 'blocked-cookies',
        panel: {
          Element: BlockedCookiesSection,
        },
      },
      {
        name: I18n.getMessage('libraryDetection'),
        link: 'library-detection',
        panel: {
          Element: LibraryDetection,
        },
      },
      {
        name: I18n.getMessage('frames'),
        link: 'frames',
        panel: {
          Element: FramesSection,
        },
      },
    ];

    if (isUsingCDP) {
      defaultSections.splice(2, 0, {
        name: I18n.getMessage('exemptionReasons'),
        link: 'exemption-reasons',
        panel: {
          Element: ExemptedCookiesSection,
        },
      });
    }

    return defaultSections;
  }, [isUsingCDP]);

  const menuData: MenuData = useMemo(
    () => sections.map(({ name, link }) => ({ name, link })),
    [sections]
  );

  return (
    <>
      <MenuBar
        disableReportDownload={showLoader}
        downloadReport={() => {
          if (tabCookies && tabFrames && libraryMatches && url) {
            downloadReport(url, tabCookies, tabFrames, libraryMatches);
          }
        }}
        menuData={menuData}
        scrollContainerId="cookies-landing-scroll-container"
      />
      {sections.map(({ link, panel: { Element, props } }) => (
        <div id={link} key={link} className="cookie-landing-section">
          {Element && <Element {...(props || {})} />}
        </div>
      ))}
    </>
  );
};
export default AssembledCookiesLanding;
