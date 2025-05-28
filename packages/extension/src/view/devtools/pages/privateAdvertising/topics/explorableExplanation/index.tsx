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
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  TabsProvider,
  useTabs,
  type TabItems,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import TopicsTable from './topicsTable';
import Panel from './panel';
import Legend from './legend';
import { useTopicsExplorableExplanation } from './useTopicsExplorableExplanation';

const TOPICS_NAVIGATOR_TAB_INDEX = 2;
const EPOCH_TRANSITION_DURATION = 2000;

const ExplorableExplanation = () => {
  const { tabStorage, setPAActiveTab, setPAStorage } = useTabs(
    ({ state, actions }) => ({
      tabStorage: state.storage,
      setPAActiveTab: actions.setActiveTab,
      setPAStorage: actions.setStorage,
      activeTab: state.activeTab,
    })
  );

  const [topicsState, topicsDispatch] = useTopicsExplorableExplanation(
    tabStorage,
    setPAStorage
  );
  const { topicsTableData, highlightAdTech } = topicsState;

  const topicsNavigator = useCallback(
    (topic: string) => {
      setPAStorage(
        JSON.stringify({
          taxonomy: topic,
        }),
        TOPICS_NAVIGATOR_TAB_INDEX
      );
      setPAActiveTab(TOPICS_NAVIGATOR_TAB_INDEX);
    },
    [setPAActiveTab, setPAStorage]
  );

  const tabItems = useMemo<TabItems>(() => {
    const items: TabItems = ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4'].map(
      (item) => ({
        title: item,
        content: {
          Element: TopicsTable,
          props: {
            data: topicsTableData,
            highlightAdTech,
            setHighlightAdTech: (value: string) =>
              topicsDispatch({
                type: 'setHighlightAdTech',
                payload: { highlightAdTech: value },
              }),
            topicsNavigator,
          },
        },
      })
    );

    items.push({
      title: 'Legend',
      content: {
        Element: Legend,
      },
    });

    return items;
  }, [highlightAdTech, topicsDispatch, topicsNavigator, topicsTableData]);

  // last tab is legend tab, so last epoch is length - 1
  const isLastEpoch = topicsState.activeEpoch === topicsState.epochs.length - 1;

  // move to next epoch when current epoch is completed
  // or pause if last epoch is reached
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const currentEpochCompleted = topicsState.completedEpochs.has(
      topicsState.activeEpoch
    );

    if (currentEpochCompleted) {
      // only do it if the animation is playing
      if (topicsState.isPlaying && !isLastEpoch) {
        timerRef.current = setTimeout(() => {
          topicsDispatch({
            type: 'setActiveEpoch',
            payload: { activeEpoch: topicsState.activeEpoch + 1 },
          });
        }, EPOCH_TRANSITION_DURATION / topicsState.sliderStep);
      }

      if (isLastEpoch && topicsState.isPlaying) {
        topicsDispatch({
          type: 'setIsPlaying',
          payload: { isPlaying: false },
        });
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    topicsState.activeEpoch,
    topicsState.completedEpochs,
    topicsState.isPlaying,
    topicsState.sliderStep,
    isLastEpoch,
    topicsDispatch,
  ]);

  useEffect(() => {
    if (
      topicsState.epochs.length > 0 &&
      topicsState.completedEpochs.size === topicsState.epochs.length
    ) {
      topicsDispatch({
        type: 'setHasAnimationFinished',
        payload: { hasAnimationFinished: true },
      });
    }
  }, [
    topicsState.isInteractive,
    topicsState.completedEpochs.size,
    topicsState.epochs.length,
    topicsDispatch,
  ]);

  return (
    <TabsProvider items={tabItems} name="topics-ee">
      <Panel topicsState={topicsState} topicsDispatch={topicsDispatch} />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
