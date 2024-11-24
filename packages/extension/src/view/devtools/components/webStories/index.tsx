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
import { ArrowUp } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import ContentPanel from './contentPanel';
import classNames from 'classnames';

const WebStories = () => {
  const [open, setOpen] = useState(true);
  const [hideHeader, setHideHeader] = useState(false);
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
    <div className="w-full h-full">
      <div className="divide-y divide-hex-gray dark:divide-quartz">
        {!hideHeader && (
          <div className="flex justify-between">
            <div className="p-4 flex flex-col gap-1">
              <button
                className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray cursor-pointer"
                onClick={() => setOpen((prevOpen) => !prevOpen)}
              >
                <h1 className="text-left">Stories</h1>
                <div>
                  <ArrowUp
                    className={classNames(open && 'rotate-180 -translate-y-1')}
                  />
                </div>
              </button>
            </div>
          </div>
        )}
        <div className={classNames({ hidden: !open })}>
          <div
            id="#__psat-main-content"
            className={classNames(
              'flex flex-col gap-6 divide-y divide-american-silver dark:divide-quartz',
              { 'px-4 py-6': !hideHeader }
            )}
          >
            <ContentPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebStories;
