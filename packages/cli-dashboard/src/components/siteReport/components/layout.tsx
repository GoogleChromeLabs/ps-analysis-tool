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
import React, { useState } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import { useContentStore } from '../stateProviders/contentStore';
import { UNKNOWN_FRAME_KEY } from '@ps-analysis-tool/common';
import { TABS } from '../tabs';
import Sidebar from './sidebar';

interface LayoutProps {
  selectedSite?: string;
}

const Layout = ({ selectedSite }: LayoutProps) => {
  const { frameUrls } = useContentStore(({ state }) => ({
    frameUrls: [
      ...new Set(
        Object.values(state.tabCookies)
          .reduce((acc, cookie) => {
            acc.push(...(cookie.frameUrls as string[]));

            return acc;
          }, [] as string[])
          .filter(
            (url) => url?.includes('http') || url === UNKNOWN_FRAME_KEY
          ) as string[]
      ),
    ],
  }));

  const [selectedSidebarOptionInd, setSelectedSidebarOptionInd] =
    useState<number>(0);

  const [selectedFrameUrl, setSelectedFrameUrl] = useState<string | null>(null);

  const TabComponent = TABS[selectedSidebarOptionInd].component;

  return (
    <div className="w-full h-full flex">
      <Resizable
        defaultSize={{ width: '200px', height: '100%' }}
        minWidth={'150px'}
        maxWidth={'98%'}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        className="h-full flex flex-col border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz pt-1"
      >
        <Sidebar
          selectedFrameUrl={selectedFrameUrl}
          setSelectedFrameUrl={setSelectedFrameUrl}
          frameUrls={frameUrls}
          selectedIndex={selectedSidebarOptionInd}
          setIndex={setSelectedSidebarOptionInd}
        />
      </Resizable>
      <div className="flex-1 max-h-screen overflow-auto">
        <TabComponent
          selectedFrameUrl={selectedFrameUrl}
          selectedSite={selectedSite}
        />
      </div>
    </div>
  );
};

export default Layout;
