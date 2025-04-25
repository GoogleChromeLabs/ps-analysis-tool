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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DraggableTray, useTabs } from '@google-psat/design-system';
import {
  assignAdtechsToSites,
  createEpochs,
  adtechs,
  websites,
} from '@google-psat/explorable-explanations';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';
import Animation from './animation';
import type { TopicsTableType } from './topicsTable';
import { getSessionStorage, updateSessionStorage } from '@google-psat/common';

const STORAGE_KEY = 'topicsExplorableExplanation';

interface PanelProps {
  topicsTableData: Record<number, TopicsTableType[]>;
  setTopicsTableData: React.Dispatch<
    React.SetStateAction<Record<number, TopicsTableType[]>>
  >;
  PAstorage: string[];
  setPAActiveTab: (tabIndex: number) => void;
  setPAStorage: (content: string, index?: number) => void;
  highlightAdTech: string | null;
  setHighlightAdTech: React.Dispatch<React.SetStateAction<string | null>>;
}

const Panel = ({
  topicsTableData,
  setTopicsTableData,
  PAstorage,
  setPAActiveTab,
  setPAStorage,
  highlightAdTech,
  setHighlightAdTech,
}: PanelProps) => {
  const { activeTab, setActiveTab } = useTabs(({ state, actions }) => ({
    activeTab: state.activeTab,
    setActiveTab: actions.setActiveTab,
  }));

  const [play, setPlay] = useState(false);
  const [reset, _setReset] = useState(false);
  const [sliderStep, setSliderStep] = useState(1);
  const [epochCompleted, setEpochCompleted] = useState<Record<number, boolean>>(
    PAstorage[1] ? JSON.parse(PAstorage[1])?.epochCompleted : {}
  );
  const [currentVisitIndexCallback, setCurrentVisitIndexCallback] =
    useState<() => number>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageRef = useRef(PAstorage);
  const activeTabRef = useRef(activeTab);
  const wasPreviousTabLegend = useRef(false);

  useEffect(() => {
    if (activeTab === 4) {
      setPlay(false);
      return;
    }

    if (activeTabRef.current === activeTab) {
      wasPreviousTabLegend.current = true;
    } else {
      wasPreviousTabLegend.current = false;
    }

    activeTabRef.current = activeTab;
  }, [activeTab]);

  const tooglePlayOnKeydown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the pressed key is the spacebar
      if (event.code === 'Space') {
        event.preventDefault();
        setPlay((prevPlay) => !prevPlay);
      }
    },
    [setPlay]
  );

  useEffect(() => {
    document.addEventListener('keydown', tooglePlayOnKeydown);

    return () => {
      document.removeEventListener('keydown', tooglePlayOnKeydown);
    };
  }, [tooglePlayOnKeydown]);

  const siteAdTechs = useMemo(() => {
    return storageRef.current[1]
      ? JSON.parse(storageRef.current[1])?.siteAdTechs
      : assignAdtechsToSites(websites, adtechs);
  }, []);

  const [epochs, setEpochs] = useState<
    {
      webVisits: { website: string; datetime: string; topics: string[] }[];
    }[]
  >([]);

  useEffect(() => {
    const storedData = JSON.parse(storageRef.current[1] || '{}');

    if (storedData?.epochs) {
      setEpochs(storedData.epochs);
      return;
    }

    const data = createEpochs();
    setEpochs(data);
  }, []);

  const [visitIndexStart, setVisitIndexStart] = useState(
    JSON.parse(storageRef.current[1] || '{}')?.currentVisitIndexes?.[
      activeTabRef.current
    ] ?? 0
  );

  useEffect(() => {
    storageRef.current = PAstorage;
  }, [PAstorage]);

  useEffect(() => {
    if (activeTab === 4 || wasPreviousTabLegend.current) {
      return;
    }

    setVisitIndexStart(
      JSON.parse(storageRef.current[1] || '{}')?.currentVisitIndexes?.[
        activeTabRef.current
      ] ?? 0
    );
  }, [activeTab]);

  useEffect(() => {
    setTopicsTableData(
      JSON.parse(storageRef.current[1] || '{}')?.topicsTableData || {}
    );
    setActiveTab(
      JSON.parse(storageRef.current[1] || '{}')?.activeEpochTab || 0
    );
  }, [setTopicsTableData, setActiveTab]);

  useEffect(() => {
    const currentVisitIndex = currentVisitIndexCallback?.();

    const visitIndexes =
      JSON.parse(storageRef.current[1] || '{}')?.currentVisitIndexes || [];
    visitIndexes[activeTabRef.current] = currentVisitIndex;

    if (currentVisitIndex !== undefined) {
      setPAStorage(
        JSON.stringify({
          currentVisitIndexes: visitIndexes,
          epochCompleted,
          topicsTableData,
          siteAdTechs,
          activeEpochTab: activeTabRef.current,
          epochs,
        })
      );
    }
  }, [
    activeTab,
    currentVisitIndexCallback,
    epochCompleted,
    epochs,
    setPAStorage,
    siteAdTechs,
    topicsTableData,
  ]);

  const setReset = useCallback(() => {
    setPlay(false);
    _setReset(true);
    setPAStorage('', 1);
    setTopicsTableData({});
    setActiveTab(0);
    setEpochCompleted({});
    setVisitIndexStart(0);

    timeoutRef.current = setTimeout(() => {
      _setReset(false);
      setPlay(true);
    }, 0);
  }, [setActiveTab, setPAStorage, setTopicsTableData]);

  useEffect(() => {
    if (activeTab === 4 || wasPreviousTabLegend.current) {
      return;
    }

    if (!epochCompleted[activeTabRef.current]) {
      setTopicsTableData((prevTopicsTableData) => {
        const newTopicsTableData = { ...prevTopicsTableData };
        newTopicsTableData[activeTabRef.current] = [];
        return newTopicsTableData;
      });
    }
  }, [activeTab, epochCompleted, setTopicsTableData]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const isCompleted = epochCompleted?.[activeTabRef.current];

    if (!isCompleted) {
      setTopicsTableData((prevTopicsTableData) => {
        const newTopicsTableData = { ...prevTopicsTableData };
        newTopicsTableData[activeTabRef.current] = [];
        return newTopicsTableData;
      });
    }
  }, [epochCompleted, setTopicsTableData]);

  const handleTopicsCalculation = useCallback(
    (visitIndex: number) => {
      setTopicsTableData((prevTopicsTableData) => {
        const { topics, website } =
          epochs[activeTabRef.current].webVisits[visitIndex];
        const topicsData = prevTopicsTableData[activeTabRef.current];
        const newTopicsTableData = {
          ...prevTopicsTableData,
        };

        const newTopicsData = topics.reduce(
          (acc, topic) => {
            const existingTopic = acc.find((t) => t.topicName === topic);
            if (existingTopic) {
              existingTopic.count += 1;
              existingTopic.observedByContextDomains = [
                ...new Set([
                  ...existingTopic.observedByContextDomains,
                  ...siteAdTechs[website],
                ]),
              ];
            } else {
              acc.push({
                topicName: topic,
                count: 1,
                observedByContextDomains: siteAdTechs[website] || [],
              });
            }
            return acc;
          },
          [...(topicsData || [])]
        );

        newTopicsTableData[activeTabRef.current] = newTopicsData;

        return newTopicsTableData;
      });
    },
    [epochs, setTopicsTableData, siteAdTechs]
  );

  const handleUserVisit = useCallback(
    (visitIndex: number, updateTopics = true) => {
      if (
        visitIndex < epochs[activeTabRef.current].webVisits.length &&
        updateTopics
      ) {
        handleTopicsCalculation(visitIndex);
      }

      if (visitIndex === epochs[activeTabRef.current].webVisits.length) {
        if (activeTabRef.current < 3 && updateTopics) {
          setActiveTab(activeTabRef.current + 1);
          setVisitIndexStart(0);
        } else {
          setPlay(false);
        }

        setEpochCompleted((prevEpochCompleted) => ({
          ...prevEpochCompleted,
          [activeTabRef.current]: true,
        }));
      }
    },
    [epochs, handleTopicsCalculation, setActiveTab]
  );

  const handlePlay = useCallback(() => {
    if (activeTabRef.current === 3 && epochCompleted[activeTabRef.current]) {
      setReset();
    } else {
      setPlay((prevPlay) => !prevPlay);
    }
  }, [epochCompleted, setReset]);

  const [isInteractiveModeOn, setIsInteractiveModeOn] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (isInteractiveModeOn === null) {
      return;
    }

    setTopicsTableData({});
    setActiveTab(0);
    setEpochCompleted({});
    setVisitIndexStart(0);
    setPAStorage('');
  }, [isInteractiveModeOn, setActiveTab, setPAStorage, setTopicsTableData]);

  const hasDataBeenFetchedFromSessionStorage = useRef<boolean>(false);
  useEffect(() => {
    (async () => {
      if (!hasDataBeenFetchedFromSessionStorage.current) {
        return;
      }

      await updateSessionStorage(
        { isInteractiveModeOn: Boolean(isInteractiveModeOn), sliderStep },
        STORAGE_KEY
      );
    })();
  }, [isInteractiveModeOn, sliderStep]);

  useEffect(() => {
    (async () => {
      const data = (await getSessionStorage(STORAGE_KEY)) || {};

      if (data?.isInteractiveModeOn) {
        setIsInteractiveModeOn(data.isInteractiveModeOn);
      }

      if (data?.sliderStep) {
        setSliderStep(data.sliderStep);
      }

      hasDataBeenFetchedFromSessionStorage.current = true;
    })();
  }, []);

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

  const extraInterface = (
    <div className="flex gap-2 items-center">
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          className="hover:cursor-pointer"
          checked={Boolean(isInteractiveModeOn)}
          onChange={() => setIsInteractiveModeOn((prev) => !prev)}
        />
        Interactive Mode
      </label>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        play={play}
        setPlay={handlePlay}
        sliderStep={sliderStep}
        setSliderStep={setSliderStep}
        historyCount={epochs[activeTabRef.current]?.webVisits.length || 0}
        reset={setReset}
        extraInterface={extraInterface}
        showNextPrevButtons={false}
        disablePlayButton={Boolean(isInteractiveModeOn)}
      />
      <div className="flex-1 overflow-auto">
        <Animation
          epoch={epochs[activeTabRef.current]?.webVisits || []}
          isAnimating={!epochCompleted?.[activeTabRef.current]}
          siteAdTechs={siteAdTechs}
          visitIndexStart={visitIndexStart}
          isPlaying={play}
          resetAnimation={reset}
          speedMultiplier={sliderStep}
          handleUserVisit={handleUserVisit}
          setPAActiveTab={setPAActiveTab}
          setHighlightAdTech={setHighlightAdTech}
          setCurrentVisitIndexCallback={setCurrentVisitIndexCallback}
          isInteractive={Boolean(isInteractiveModeOn)}
        />
      </div>
      <DraggableTray ref={draggableTrayRef} />
    </div>
  );
};

export default Panel;
