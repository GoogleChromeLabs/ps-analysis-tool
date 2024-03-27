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
import React from 'react';
import { LibraryDetection } from '@ps-analysis-tool/library-detection';
import { MenuBar, type MenuData } from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import CookiesSection from './cookiesSection';
import FramesSection from './framesSection';
import BlockedCookiesSection from './blockedCookiesSection';

const menuData: MenuData = [
  {
    name: 'Cookies',
    link: 'cookies',
  },
  {
    name: 'Blocked Cookies',
    link: 'blocked-cookies',
  },
  {
    name: 'Library Detection',
    link: 'library-detection',
  },
  {
    name: 'Frames',
    link: 'frames',
  },
];

const AssembledCookiesLanding = () => {
  return (
    <MenuBar menuData={menuData}>
      <div id={menuData[0].link}>
        <CookiesSection />
      </div>
      <div id={menuData[1].link}>
        <BlockedCookiesSection />
      </div>
      <div id={menuData[2].link}>
        <LibraryDetection />
      </div>
      <div id={menuData[3].link}>
        <FramesSection />
      </div>
    </MenuBar>
  );
};
export default AssembledCookiesLanding;
