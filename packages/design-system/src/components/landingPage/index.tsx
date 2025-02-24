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
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import { getStoryPlayerMarkup } from './getStoryPlayerMarkup';
import LandingPage, { LandingPageProps } from './LandingPage';
import ContentPanel from './contentPanel';

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
  const [isPageReady, setIsPageReady] = useState<boolean>(false);
  const { children, contentPanelTitle, content, counterStyles, titleStyles } =
    props;

  useEffect(() => {
    setIsPageReady(true);
    return () => {
      setIsPageReady(false);
    };
  }, []);

  useEffect(() => {
    if (!independentStory) {
      return;
    }
    // send message to the right iframe
    const iframe = document.getElementById(independentStory);
    if (iframe) {
      (iframe as HTMLIFrameElement).contentWindow?.postMessage({
        storyUrl: independentStory,
      });
    }
  }, [independentStory]);

  useEffect(() => {
    const eventListener = (event: CustomEvent) => {
      if (event?.detail?.storyOpened === false) {
        setIndependentStory('');
      }
    };

    // @ts-ignore since this is a custom event.
    document.addEventListener('webStoriesLightBoxEvent', eventListener, false);

    return () => {
      // @ts-ignore since this is a custom event.
      document.removeEventListener(
        'webStoriesLightBoxEvent',
        eventListener,
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
              };
            })}
            counterStyles={counterStyles}
            titleStyles={titleStyles}
          />
        }
      >
        {children}
      </LandingPage>
      {isPageReady &&
        // we need to create a new iframe for each story in order to preload the story
        content.map((data) => {
          return (
            <iframe
              id={data.storyUrl}
              key={data.storyUrl}
              onLoad={(event: React.SyntheticEvent<HTMLIFrameElement>) => {
                (event.target as HTMLIFrameElement).contentWindow?.postMessage(
                  {
                    storyUrl: data.storyUrl,
                    preload: true,
                  },
                  '*'
                );
              }}
              srcDoc={getStoryPlayerMarkup()}
              style={{
                display: data.storyUrl === independentStory ? 'block' : 'none',
                height: data.storyUrl === independentStory ? '100%' : '0%',
                width: data.storyUrl === independentStory ? '100%' : '0%',
                position: 'fixed',
              }}
              className="w-full h-full overflow-hidden absolute top-0 border-none z-10"
            />
          );
        })}
    </>
  );
};

export default LandingPageContainer;
