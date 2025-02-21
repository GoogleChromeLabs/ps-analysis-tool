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
 * External dependencies
 */
import React, { useEffect, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { getStoryPlayerMarkup } from './getStoryPlayerMarkup';
import LandingPage, { LandingPageProps } from './LandingPage';
import ContentPanel from './contentPanel';
import { prefetchPageAssets } from '@google-psat/common';

type LandingPageContainerProps = LandingPageProps & {
  contentPanelTitle: string;
  content: {
    title: () => string;
    description: () => string;
    url: string;
    storyUrl?: string;
  }[];
  counterStyles: string;
  titleStyles: string;
};

const LandingPageContainer = (props: LandingPageContainerProps) => {
  const [independentStory, setIndependentStory] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { children, contentPanelTitle, content, counterStyles, titleStyles } =
    props;

  const prefetchAssets = (storyUrl: string) => {
    if (!storyUrl) {
      return;
    }

    prefetchPageAssets(storyUrl, {
      resourceType: ['script'],
      getAssetsUrl: (doc) => {
        return Array.from(doc.getElementsByTagName('amp-img')).map(
          (img) => img.getAttribute('src') ?? ''
        );
      },
    });
  };

  useEffect(() => {
    if (!independentStory || !iframeRef.current) {
      return;
    }

    iframeRef.current.contentWindow?.postMessage({
      storyUrl: independentStory,
    });
  }, [independentStory]);

  useEffect(() => {
    document.addEventListener(
      'webStoriesLightBoxEvent',
      //@ts-ignore since this is a custom event.
      (event) => {
        //@ts-ignore since this is a custom data.
        if (event?.detail?.storyOpened === false) {
          setIndependentStory('');
        }
      },
      false
    );

    return () => {
      document.removeEventListener(
        'webStoriesLightBoxEvent',
        //@ts-ignore since this is a custom event.
        (event) => {
          //@ts-ignore since this is a custom data.
          if (event?.detail?.storyOpened === false) {
            setIndependentStory('');
          }
        },
        false
      );
    };
  }, []);

  return (
    <>
      <LandingPage
        {...props}
        containerStyles={independentStory ? 'z-0 absolute top-0 ' : ''}
        contentPanel={
          <ContentPanel
            title={contentPanelTitle}
            content={content.map((data) => {
              return {
                ...data,
                onClick: () => setIndependentStory(data?.storyUrl ?? ''),
                onMouseEnter: () => prefetchAssets(data?.storyUrl ?? ''),
              };
            })}
            counterStyles={counterStyles}
            titleStyles={titleStyles}
          />
        }
      >
        {children}
      </LandingPage>
      <iframe
        ref={iframeRef}
        srcDoc={getStoryPlayerMarkup()}
        style={{
          display: independentStory ? 'block' : 'none',
          height: independentStory ? '100%' : '0%',
          width: independentStory ? '100%' : '0%',
          position: 'fixed',
        }}
        className="w-full h-full overflow-hidden absolute top-0 border-none z-10"
      />
    </>
  );
};

export default LandingPageContainer;
