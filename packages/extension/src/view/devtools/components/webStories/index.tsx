/*
 * Copyright 2024 Google LLC
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
import React, { useCallback, useEffect, useState } from 'react';
import { LandingPage, TableProvider } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import ContentPanel from './contentPanel';
import { noop } from '@google-psat/common';

const WebStories = () => {
  // const [open, setOpen] = useState(true);
  const [, setHideHeader] = useState(false);
  //@ts-ignore since this is a custom event.
  const webStoriesLightBoxCallback = useCallback((event) => {
    setHideHeader(() => event.detail.storyOpened);
  }, []);

  useEffect(() => {
    window.document.addEventListener(
      'webStoriesLightBoxEvent',
      webStoriesLightBoxCallback,
      false
    );

    return () => {
      window.document.removeEventListener(
        'webStoriesLightBoxEvent',
        webStoriesLightBoxCallback,
        false
      );
    };
  }, [webStoriesLightBoxCallback]);

  return (
    <div className="w-full h-full overflow-hidden">
      <LandingPage
        title={'Stories'}
        extraClasses="w-full !p-0"
        contentPanel={
          <TableProvider
            data={[]}
            tableColumns={[]}
            tableFilterData={{}}
            tableSearchKeys={[]}
            onRowClick={noop}
            onRowContextMenu={noop}
            getRowObjectKey={() => ''}
          >
            <ContentPanel />
          </TableProvider>
        }
        showQuickLinks={false}
      />
    </div>
  );
};

export default WebStories;
