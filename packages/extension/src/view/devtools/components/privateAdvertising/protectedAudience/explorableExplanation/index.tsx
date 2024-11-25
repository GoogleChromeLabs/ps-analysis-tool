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
import { TabsProvider, type TabItems } from '@google-psat/design-system';
import React, { useMemo } from 'react';

/**
 * Internal dependencies.
 */
import InterestGroups from '../interestGroups';
import Auctions from '../auctions';
import AdUnits from '../adUnits';
import Bids from '../bids';
import Panel from './panel';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

const ExplorableExplanation = () => {
  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Interest Groups',
        content: {
          Element: InterestGroups,
        },
      },
      {
        title: 'Auctions',
        content: {
          Element: Auctions,
        },
      },
      {
        title: 'Ad Units',
        content: {
          Element: AdUnits,
        },
      },
      {
        title: 'Bids',
        content: {
          Element: Bids,
        },
      },
    ],
    []
  );
  const handleResizeCallback = useMemo(() => {
    return new ResizeObserver(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const newSize = Math.min(containerWidth, containerHeight) / 2;
        const centerX = (containerWidth - newSize) / 4;
        const centerY = (containerHeight - newSize) / 4;

        setBubbleWidth(newSize);
        setExpandedBubbleX(centerX);
        setExpandedBubbleY(centerY);
      }
    });
  }, []);

  useEffect(() => {
    if (divRef.current) {
      const divRect = divRef.current.getBoundingClientRect();
      const visibleWidth = Math.max(
        0,
        Math.min(divRect.right, window.innerWidth) - Math.max(divRect.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(divRect.bottom, window.innerHeight) - Math.max(divRect.top, 0)
      );

      const newSize = Math.min(visibleWidth, visibleHeight) / 2;
      const centerX = (visibleWidth - newSize) / 4;
      const centerY = (visibleHeight - newSize) / 4;

      setBubbleWidth(newSize);
      setExpandedBubbleX(centerX);
      setExpandedBubbleY(centerY);
    }
    if (containerRef.current) {
      handleResizeCallback.observe(containerRef.current);
    }
    const containerRefCopy = containerRef;
    return () => {
      if (containerRefCopy.current) {
        handleResizeCallback.unobserve(containerRefCopy.current);
      }
    };
  }, [handleResizeCallback]);

  return (
    <TabsProvider items={tabItems}>
      <Panel />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
