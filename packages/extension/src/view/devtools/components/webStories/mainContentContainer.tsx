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
import { ProgressBar } from '@google-psat/design-system';
import React, { useEffect, useRef } from 'react';
/**
 * Internal dependencies
 */
import { useWebStories } from '../../stateProviders';
import { getStaticStoryMarkup } from '../../stateProviders/webStories/getStaticStoryMarkup';

export const MainContentContainer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    loadingState,
    allStoryJSON,
    iframeLoaded,
    doesHaveMorePages,
    setIframeLoaded,
  } = useWebStories(({ state, actions }) => ({
    iframeLoaded: state.iframeLoaded,
    loadingState: state.loadingState,
    doesHaveMorePages: state.doesHaveMorePages,
    allStoryJSON: state.allStoryJSON,
    setIframeLoaded: actions.setIframeLoaded,
  }));

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }

    if (loadingState || !iframeLoaded || !allStoryJSON) {
      return;
    }

    iframeRef.current?.contentWindow?.postMessage(
      {
        story: allStoryJSON,
        doesHaveMorePages,
      },
      '*'
    );
  }, [allStoryJSON, loadingState, iframeLoaded, doesHaveMorePages]);

  if (loadingState && allStoryJSON.length === 0) {
    return <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />;
  } else if (allStoryJSON.length > 0) {
    return (
      <div className="flex-1 h-full w-full flex-col">
        {loadingState && allStoryJSON.length > 0 && (
          <ProgressBar additionalStyles="w-full mx-auto" />
        )}
        <iframe
          ref={iframeRef}
          onLoad={() => setIframeLoaded(true)}
          srcDoc={getStaticStoryMarkup()}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden',
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 text-base h-full w-full flex items-center justify-center text-raisin-black dark:text-bright-gray">
      No stories found with given filters.
    </div>
  );
};
