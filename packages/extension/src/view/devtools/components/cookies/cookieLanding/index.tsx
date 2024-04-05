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
import { LibraryDetection } from '@ps-analysis-tool/library-detection';
import {
  MenuBar,
  type CookiesLandingSection,
  type MenuData,
} from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import CookiesSection from './cookiesSection';
import FramesSection from './framesSection';
import BlockedCookiesSection from './blockedCookiesSection';
import ExemptedCookiesSection from './exemptedCookiesSection';

const AssembledCookiesLanding = () => {
  const sections: Array<CookiesLandingSection> = useMemo(
    () => [
      {
        name: 'Cookies',
        link: 'cookies',
        panel: {
          Element: CookiesSection,
        },
      },
      {
        name: 'Blocked Cookies',
        link: 'blocked-cookies',
        panel: {
          Element: BlockedCookiesSection,
        },
      },
      {
        name: 'Exemption Reason',
        link: 'exemption-reasons',
        panel: {
          Element: ExemptedCookiesSection,
        },
      },
      {
        name: 'Library Detection',
        link: 'library-detection',
        panel: {
          Element: LibraryDetection,
        },
      },
      {
        name: 'Frames',
        link: 'frames',
        panel: {
          Element: FramesSection,
        },
      },
    ],
    []
  );

  const menuData: MenuData = useMemo(
    () => sections.map(({ name, link }) => ({ name, link })),
    [sections]
  );

  return (
    <>
      <MenuBar
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
