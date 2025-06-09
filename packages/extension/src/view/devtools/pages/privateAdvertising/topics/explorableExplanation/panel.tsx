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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DraggableTray, useTabs } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';
import Animation from './animation';
import type {
  TopicsExplorableExplanationAction,
  TopicsExplorableExplanationState,
} from './useTopicsExplorableExplanation';

interface PanelProps {
  topicsState: TopicsExplorableExplanationState;
  topicsDispatch: React.Dispatch<TopicsExplorableExplanationAction>;
}

const Panel = ({ topicsState, topicsDispatch }: PanelProps) => {
  const {
    isInteractive,
    isPlaying,
    sliderStep,
    activeEpoch,
    epochs,
    highlightAdTech,
    hasAnimationFinished,
    isTabStorageLoaded,
  } = topicsState;

  const { setActiveTab, activeTab } = useTabs(({ actions, state }) => ({
    setActiveTab: actions.setActiveTab,
    activeTab: state.activeTab,
  }));

  // keeps tab in sync with active epoch
  useEffect(() => {
    if (isTabStorageLoaded) {
      setActiveTab(activeEpoch);
    }
  }, [setActiveTab, activeEpoch, isTabStorageLoaded]);

  // prevent circular dependency
  const lastTab = useRef(activeTab);
  // sync active epoch with active tab
  useEffect(() => {
    const legendTab = activeTab === epochs.length;
    if (!legendTab && activeTab !== lastTab.current) {
      lastTab.current = activeTab;
      topicsDispatch({
        type: 'setActiveEpoch',
        payload: { activeEpoch: activeTab },
      });
    }
  }, [activeTab, epochs.length, topicsDispatch]);

  const handlePlay = useCallback(() => {
    topicsDispatch({
      type: 'setIsPlaying',
      payload: { isPlaying: !isPlaying },
    });
  }, [topicsDispatch, isPlaying]);

  const handleSliderStep = useCallback(
    (step: number) => {
      topicsDispatch({ type: 'setSliderStep', payload: { sliderStep: step } });
    },
    [topicsDispatch]
  );

  const handleInteractiveMode = useCallback(() => {
    topicsDispatch({
      type: 'setIsInteractive',
      payload: { isInteractive: !isInteractive },
    });
  }, [topicsDispatch, isInteractive]);

  const handleReset = useCallback(() => {
    topicsDispatch({ type: 'reset' });
  }, [topicsDispatch]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const draggableTrayRef = useRef({
    isCollapsed,
    setIsCollapsed,
  });

  useEffect(() => {
    if (highlightAdTech) {
      draggableTrayRef.current?.setIsCollapsed(false);
    }
  }, [highlightAdTech]);

  const tooglePlayOnKeydown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the pressed key is the spacebar
      if (event.code === 'Space') {
        event.preventDefault();
        handlePlay();
      }
    },
    [handlePlay]
  );

  useEffect(() => {
    document.addEventListener('keydown', tooglePlayOnKeydown);
    return () => {
      document.removeEventListener('keydown', tooglePlayOnKeydown);
    };
  }, [tooglePlayOnKeydown]);

  const extraInterface = (
    <div className="flex gap-2 items-center">
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          className="hover:cursor-pointer"
          checked={isInteractive}
          onChange={handleInteractiveMode}
        />
        Interactive Mode
      </label>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        play={isPlaying}
        setPlay={handlePlay}
        sliderStep={sliderStep}
        setSliderStep={handleSliderStep}
        historyCount={epochs[activeEpoch]?.webVisits.length || 0}
        reset={handleReset}
        extraInterface={extraInterface}
        showNextPrevButtons={false}
        disablePlayButton={isInteractive || hasAnimationFinished}
      />
      <div className="flex-1 overflow-auto">
        <Animation topicsState={topicsState} topicsDispatch={topicsDispatch} />
      </div>
      <DraggableTray ref={draggableTrayRef} />
    </div>
  );
};

export default Panel;
