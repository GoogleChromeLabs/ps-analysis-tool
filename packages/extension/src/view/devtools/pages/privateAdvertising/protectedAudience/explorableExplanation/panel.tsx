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
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  app,
  userSketch,
  interestGroupSketch,
  sketch as mainSketch,
  config,
  // @ts-ignore package does not have types
} from '@google-psat/explorable-explanations';
import { ReactP5Wrapper } from '@p5-wrapper/react';
import { DraggableTray, useTabs } from '@google-psat/design-system';
import { getSessionStorage, updateSessionStorage } from '@google-psat/common';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';
import type { CurrentSiteData, StepType } from './auctionEventTransformers';
import { useSettings } from '../../../../stateProviders';

const STORAGE_KEY = 'paExplorableExplanation';
const DEFAULT_SETTINGS = {
  isAutoScroll: true,
  isAutoExpand: true,
  speedMultiplier: 1,
};

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
interface PanelProps {
  setCurrentSite: (siteData: CurrentSiteData | null) => void;
  currentSiteData: CurrentSiteData | null;
  highlightedInterestGroup: {
    interestGroupName: string;
    interestGroupOwner: string;
    color: string;
  } | null;
  setHighlightedInterestGroup: React.Dispatch<
    React.SetStateAction<{
      interestGroupName: string;
      interestGroupOwner: string;
      color: string;
    } | null>
  >;
  isMultiSeller: boolean;
  setIsMultiSeller: React.Dispatch<React.SetStateAction<boolean>>;
  interactiveMode: boolean;
  setInteractiveMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setInfo: React.Dispatch<React.SetStateAction<string | null>>;
  info: string | null;
  setCurrentStep: React.Dispatch<React.SetStateAction<StepType>>;
  setSelectedAdUnit: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedDateTime: React.Dispatch<React.SetStateAction<string | null>>;
  interestGroupUpdateIndicator: number;
  auctionUpdateIndicator: number;
  bidsUpdateIndicator: number;
  setHasLastNodeVisited: React.Dispatch<React.SetStateAction<boolean>>;
}

const Panel = ({
  setCurrentSite,
  highlightedInterestGroup,
  setHighlightedInterestGroup,
  isMultiSeller,
  setIsMultiSeller,
  interactiveMode,
  setInteractiveMode,
  info,
  setInfo,
  setCurrentStep,
  setSelectedAdUnit,
  setSelectedDateTime,
  interestGroupUpdateIndicator,
  auctionUpdateIndicator,
  bidsUpdateIndicator,
  setHasLastNodeVisited,
}: PanelProps) => {
  const [play, setPlay] = useState(false);
  const [sliderStep, setSliderStep] = useState(1);
  const [autoExpand, setAutoExpand] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const historyCount = config.timeline.circles.length;
  const divRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const draggableTrayRef = useRef({
    isCollapsed,
    setIsCollapsed,
  });
  const [expandedBubbleWidth, setBubbleWidth] = useState(0);
  const [expandedBubbleX, setExpandedBubbleX] = useState(0);
  const [expandedBubbleY, setExpandedBubbleY] = useState(0);
  const [isBubbleExpanded, setIsBubbleExpanded] = useState(false);
  const hasDataBeenFetchedFromSessionStorage = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!hasDataBeenFetchedFromSessionStorage.current) {
        return;
      }

      await updateSessionStorage(
        { autoExpand, autoScroll, sliderStep },
        STORAGE_KEY
      );
    })();
  }, [autoExpand, autoScroll, sliderStep]);

  const _setHighLightedInterestGroup = useCallback(
    (
      value: {
        interestGroupName: string;
        interestGroupOwner: string;
        color: string;
      } | null
    ) => {
      if (value) {
        draggableTrayRef.current.setIsCollapsed(false);
      }

      setHighlightedInterestGroup(value);
    },
    [setHighlightedInterestGroup]
  );

  useEffect(() => {
    (async () => {
      const data = (await getSessionStorage(STORAGE_KEY)) || {};
      if (Object.prototype.hasOwnProperty.call(data, 'autoExpand')) {
        setAutoExpand(data.autoExpand);
      }

      if (Object.prototype.hasOwnProperty.call(data, 'autoScroll')) {
        setAutoScroll(data.autoScroll);
      }

      if (Object.prototype.hasOwnProperty.call(data, 'sliderStep')) {
        setSliderStep(data.sliderStep);
      }

      hasDataBeenFetchedFromSessionStorage.current = true;
    })();

    return () => {
      app.isAutoExpand = DEFAULT_SETTINGS.isAutoExpand;
      app.autoScroll = DEFAULT_SETTINGS.isAutoScroll;
      app.speedMultiplier = DEFAULT_SETTINGS.speedMultiplier;
    };
  }, []);

  const setPlaying = useCallback(() => {
    setPlay((prevState) => {
      if (!prevState) {
        app.play(true);
      } else {
        app.pause();
      }
      return !prevState;
    });
  }, []);

  const tooglePlayOnKeydown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the pressed key is the spacebar
      if (event.code === 'Space') {
        event.preventDefault();
        setPlaying();
      }
    },
    [setPlaying]
  );

  const { setActiveTab, highlightTab } = useTabs(({ actions }) => ({
    setActiveTab: actions.setActiveTab,
    highlightTab: actions.highlightTab,
  }));

  const { OSInformation } = useSettings(({ state }) => ({
    OSInformation: state.OSInformation,
  }));

  useEffect(() => {
    if (highlightedInterestGroup) {
      setActiveTab(0);
    }
  }, [highlightedInterestGroup, setActiveTab]);

  useEffect(() => {
    if (info) {
      setActiveTab(3);
      draggableTrayRef.current.setIsCollapsed(false);
    }
  }, [info, setActiveTab]);

  useEffect(() => {
    document.addEventListener('keydown', tooglePlayOnKeydown);

    return () => {
      document.removeEventListener('keydown', tooglePlayOnKeydown);
    };
  }, [tooglePlayOnKeydown]);

  useEffect(() => {
    if (interestGroupUpdateIndicator !== -1) {
      highlightTab(1, false);
      highlightTab(2, false);
      highlightTab(0);
    } else {
      highlightTab(0, false);
    }
  }, [interestGroupUpdateIndicator, highlightTab]);

  useEffect(() => {
    if (auctionUpdateIndicator !== -1) {
      highlightTab(1);
    } else {
      highlightTab(1, false);
    }
  }, [auctionUpdateIndicator, highlightTab]);

  useEffect(() => {
    if (bidsUpdateIndicator !== -1) {
      highlightTab(2);
    } else {
      highlightTab(2, false);
    }
  }, [bidsUpdateIndicator, highlightTab]);

  const handleResizeCallback = useMemo(() => {
    return new ResizeObserver(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const newSize = Math.min(containerWidth, containerHeight) * 0.8;

        setBubbleWidth(newSize);
      }
    });
  }, []);

  const getDivDimensions = useCallback(() => {
    if (!divRef.current) {
      return {
        visibleWidth: 0,
        visibleHeight: 0,
        newSize: 0,
      };
    }

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

    return {
      visibleWidth,
      visibleHeight,
      newSize,
    };
  }, []);

  useEffect(() => {
    if (divRef.current) {
      const { newSize } = getDivDimensions();

      setBubbleWidth(newSize);
    }

    if (containerRef.current) {
      handleResizeCallback.observe(containerRef.current);
    }

    const containerRefCopy = containerRef;

    return () => {
      app.reset();
      if (containerRefCopy.current) {
        handleResizeCallback.unobserve(containerRefCopy.current);
      }
    };
  }, [getDivDimensions, handleResizeCallback]);

  useEffect(() => {
    if (isBubbleExpanded) {
      const div = divRef.current;

      if (div) {
        const { visibleWidth, visibleHeight, newSize } = getDivDimensions();
        const centerX = visibleWidth / 2 - newSize;
        const centerY = visibleHeight / 4 - newSize / 4;

        setExpandedBubbleX(centerX);
        setExpandedBubbleY(centerY);
      }
    }
  }, [getDivDimensions, isBubbleExpanded]);

  const resetHandler = useCallback(() => {
    app.reset();
    setHasLastNodeVisited(false);
    setCurrentSite(null);
  }, [setCurrentSite, setHasLastNodeVisited]);

  const extraInterface = (
    <div className="flex gap-3 items-center">
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          checked={interactiveMode}
          onChange={setInteractiveMode}
          className="hover:cursor-pointer"
        />
        <span className="whitespace-nowrap">Interactive Mode</span>
      </label>
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          checked={isMultiSeller}
          onChange={(event) => setIsMultiSeller(event.target.checked)}
          className="hover:cursor-pointer"
        />
        <span className="whitespace-nowrap">Multi Seller</span>
      </label>
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          checked={autoExpand}
          onChange={(event) => setAutoExpand(event.target.checked)}
          className="hover:cursor-pointer"
        />
        <span className="whitespace-nowrap">Auto Expand</span>
      </label>
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          checked={autoScroll}
          onChange={(event) => setAutoScroll(event.target.checked)}
          className="hover:cursor-pointer"
        />
        <span className="whitespace-nowrap">Auto Scroll</span>
      </label>
    </div>
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{
        '--expandedBubbleWidth': `${expandedBubbleWidth}px`,
        '--expandedBubbleX': `${expandedBubbleX}px`,
        '--expandedBubbleY': `${expandedBubbleY}px`,
      }}
    >
      <Header
        play={play}
        setPlay={setPlaying}
        sliderStep={sliderStep}
        setSliderStep={setSliderStep}
        historyCount={historyCount}
        reset={resetHandler}
        showNextPrevButtons={true}
        extraInterface={extraInterface}
      />
      <div className="w-full h-full">
        <main
          className={classNames('h-full w-full relative', {
            'overflow-hidden': isBubbleExpanded,
            'overflow-auto': !isBubbleExpanded,
          })}
          ref={divRef}
        >
          <div id="ps-canvas">
            <div id="canvas-container" />
          </div>
          <div id="interest-canvas"></div>
          <div
            id="bubble-container-div"
            className="bubble-container"
            ref={containerRef}
          >
            <div
              id="minified-bubble-container"
              className="minified-bubble-container"
            >
              <span id="count-display"></span>
            </div>
            <div id="open-button" style={{ color: 'black' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#808080"
              >
                <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" />
              </svg>
            </div>
            <div id="close-button" style={{ color: 'black' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M440-440v240h-80v-160H200v-80h240Zm160-320v160h160v80H520v-240h80Z" />
              </svg>
            </div>
          </div>
          <div id="user-canvas"></div>
        </main>
      </div>
      {/* Main Canvas */}
      <ReactP5Wrapper sketch={mainSketch} isMultiSeller={isMultiSeller} />
      {/* Interest Group Canvas */}
      <ReactP5Wrapper
        autoExpand={autoExpand}
        sketch={interestGroupSketch}
        expandedBubbleX={expandedBubbleX}
        expandedBubbleY={expandedBubbleY}
        setIsBubbleExpanded={setIsBubbleExpanded}
        expandedBubbleWidth={expandedBubbleWidth}
        speedMultiplier={2 * sliderStep}
        setCurrentSite={setCurrentSite}
        setPlayState={setPlay}
        setInfo={setInfo}
        setCurrentStep={setCurrentStep}
        autoScroll={autoScroll}
        setHighlightedInterestGroup={_setHighLightedInterestGroup}
        setSelectedAdUnit={setSelectedAdUnit}
        setSelectedDateTime={setSelectedDateTime}
        setHasLastNodeVisited={setHasLastNodeVisited}
        platform={OSInformation ?? ''}
      />
      <ReactP5Wrapper sketch={userSketch} />
      <DraggableTray ref={draggableTrayRef} trayId="explorableExplanation" />
    </div>
  );
};

export default Panel;
