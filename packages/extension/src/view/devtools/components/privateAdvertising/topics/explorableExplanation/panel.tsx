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

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';
import Animation from './animation';
import { assignAdtechsToSites, createEpochs } from './topicsAnimation/utils';
import { adtechs, websites } from './topicsAnimation/data';
import type { TopicsTableType } from './topicsTable';

interface PanelProps {
  topicsTableData: Record<number, TopicsTableType[]>;
  setTopicsTableData: React.Dispatch<
    React.SetStateAction<Record<number, TopicsTableType[]>>
  >;
  PAstorage: string[];
  setPAActiveTab: (tabIndex: number) => void;
  setPAStorage: (content: string) => void;
  setHighlightAdTech: React.Dispatch<React.SetStateAction<string | null>>;
}

const Panel = ({
  topicsTableData,
  setTopicsTableData,
  PAstorage,
  setPAActiveTab,
  setPAStorage,
  setHighlightAdTech,
}: PanelProps) => {
  const { activeTab, setActiveTab } = useTabs(({ state, actions }) => ({
    activeTab: state.activeTab,
    setActiveTab: actions.setActiveTab,
  }));

  const [play, setPlay] = useState(true);
  const [reset, _setReset] = useState(false);
  const [sliderStep, setSliderStep] = useState(1);
  const [epochCompleted, setEpochCompleted] = useState<Record<number, boolean>>(
    PAstorage[1] ? JSON.parse(PAstorage[1])?.epochCompleted : {}
  );
  const [currentVisitIndexCallback, setCurrentVisitIndexCallback] =
    useState<() => number>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageRef = useRef(PAstorage);
  const siteAdTechs = useMemo(() => {
    return storageRef.current[1]
      ? JSON.parse(storageRef.current[1])?.siteAdTechs
      : assignAdtechsToSites(websites, adtechs);
  }, []);
  const epochs = useMemo(() => {
    return (
      (JSON.parse(storageRef.current[1] || '{}')?.epochs as ReturnType<
        typeof createEpochs
      >) ?? createEpochs()
    );
  }, []);
  const [visitIndexStart, setVisitIndexStart] = useState(
    JSON.parse(storageRef.current[1] || '{}')?.currentVisitIndexes?.[
      activeTab
    ] ?? 0
  );

  useEffect(() => {
    storageRef.current = PAstorage;
  }, [PAstorage]);

  useEffect(() => {
    setVisitIndexStart(
      JSON.parse(storageRef.current[1] || '{}')?.currentVisitIndexes?.[
        activeTab
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
    visitIndexes[activeTab] = currentVisitIndex;

    if (currentVisitIndex !== undefined) {
      setPAStorage(
        JSON.stringify({
          currentVisitIndexes: visitIndexes,
          epochCompleted,
          topicsTableData,
          siteAdTechs,
          activeEpochTab: activeTab,
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
    setSliderStep(1);
    setTopicsTableData({});
    setActiveTab(0);
    setEpochCompleted({});

    timeoutRef.current = setTimeout(() => {
      _setReset(false);
      setPlay(true);
    }, 0);
  }, [setActiveTab, setTopicsTableData]);

  useEffect(() => {
    if (!epochCompleted[activeTab]) {
      setTopicsTableData((prevTopicsTableData) => {
        const newTopicsTableData = { ...prevTopicsTableData };
        newTopicsTableData[activeTab] = [];
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

  const handleTopicsCalculation = useCallback(
    (visitIndex: number) => {
      setTopicsTableData((prevTopicsTableData) => {
        const { topics, website } = epochs[activeTab].webVisits[visitIndex];
        const topicsData = prevTopicsTableData[activeTab];
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

        newTopicsTableData[activeTab] = newTopicsData;

        return newTopicsTableData;
      });
    },
    [activeTab, epochs, setTopicsTableData, siteAdTechs]
  );

  const handleUserVisit = useCallback(
    (visitIndex: number, updateTopics = true) => {
      if (visitIndex < epochs[activeTab].webVisits.length && updateTopics) {
        handleTopicsCalculation(visitIndex);
      }

      if (visitIndex === epochs[activeTab].webVisits.length) {
        if (activeTab < 3 && updateTopics) {
          setActiveTab(activeTab + 1);
          setVisitIndexStart(0);
        } else {
          setPlay(false);
        }

        setEpochCompleted((prevEpochCompleted) => ({
          ...prevEpochCompleted,
          [activeTab]: true,
        }));
      }
    },
    [activeTab, epochs, handleTopicsCalculation, setActiveTab]
  );

  const handlePlay = useCallback(() => {
    if (activeTab === 3 && epochCompleted[activeTab]) {
      setReset();
    } else {
      setPlay((prevPlay) => !prevPlay);
    }
  }, [activeTab, epochCompleted, setReset]);

  const [isInteractiveModeOn, setIsInteractiveModeOn] = useState(false);

  useEffect(() => {
    setTopicsTableData({});
    setActiveTab(0);
    setEpochCompleted({});
    setPAStorage('');
  }, [isInteractiveModeOn, setActiveTab, setPAStorage, setTopicsTableData]);

  const extraInterface = (
    <div className="flex gap-2 items-center">
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          className="hover:cursor-pointer"
          checked={isInteractiveModeOn}
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
        historyCount={epochs[activeTab].webVisits.length}
        reset={setReset}
        extraInterface={extraInterface}
        showNextPrevButtons={false}
      />
      <div className="flex-1 overflow-auto">
        <Animation
          epoch={epochs[activeTab].webVisits}
          isAnimating={!epochCompleted?.[activeTab]}
          siteAdTechs={siteAdTechs}
          visitIndexStart={visitIndexStart}
          isPlaying={play}
          resetAnimation={reset}
          speedMultiplier={sliderStep}
          handleUserVisit={handleUserVisit}
          setPAActiveTab={setPAActiveTab}
          setPAStorage={setPAStorage}
          setHighlightAdTech={setHighlightAdTech}
          setCurrentVisitIndexCallback={setCurrentVisitIndexCallback}
          isInteractive={isInteractiveModeOn}
        />
      </div>
      <DraggableTray />
    </div>
  );
};

export default Panel;
