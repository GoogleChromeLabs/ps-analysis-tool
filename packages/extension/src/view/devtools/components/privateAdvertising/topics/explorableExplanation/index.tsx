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
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';
import Tray from './tray';
import Animation from './animation';
import { assignAdtechsToSites, createEpochs } from './topicsAnimation/utils';
import type { TopicsTableType } from './topicsTable';
import { adtechs, websites } from './topicsAnimation/data';

const ExplorableExplanation = () => {
  const [play, setPlay] = useState(true);
  const [reset, _setReset] = useState(false);
  const [sliderStep, setSliderStep] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [topicsTableData, setTopicsTableData] = useState<TopicsTableType[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const epochs = useMemo(() => createEpochs(), []);
  const siteAdTechs = useMemo(() => {
    return assignAdtechsToSites(websites, adtechs);
  }, []);

  const setReset = useCallback(() => {
    setPlay(false);
    _setReset(true);
    setSliderStep(1);
    setTopicsTableData([]);

    timeoutRef.current = setTimeout(() => {
      _setReset(false);
      setPlay(true);
    }, 0);
  }, []);

  useEffect(() => {
    setTopicsTableData([]);
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleUserVisit = useCallback(
    (visitIndex: number) => {
      if (visitIndex < epochs[activeTab].webVisits.length) {
        setTopicsTableData((prevTopicsTableData) => {
          const { topics, website } = epochs[activeTab].webVisits[visitIndex];

          const newTopicsTableData = topics.reduce(
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
            [...prevTopicsTableData]
          );

          return newTopicsTableData;
        });
      }

      if (visitIndex === epochs[activeTab].webVisits.length && activeTab < 3) {
        setActiveTab((prevActiveTab) => prevActiveTab + 1);
      }
    },
    [activeTab, epochs, siteAdTechs]
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        play={play}
        setPlay={setPlay}
        sliderStep={sliderStep}
        setSliderStep={setSliderStep}
        historyCount={epochs[activeTab].webVisits.length}
        reset={setReset}
      />
      <div className="flex-1 overflow-auto">
        <Animation
          epoch={epochs[activeTab].webVisits}
          siteAdTechs={siteAdTechs}
          isPlaying={play}
          resetAnimation={reset}
          speedMultiplier={sliderStep}
          handleUserVisit={handleUserVisit}
        />
      </div>
      <Resizable
        defaultSize={{
          width: '100%',
          height: '20%',
        }}
        minHeight="15%"
        maxHeight="95%"
        enable={{
          top: true,
        }}
        className="h-full flex"
      >
        <Tray
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          topicsTableData={topicsTableData}
        />
      </Resizable>
    </div>
  );
};

export default ExplorableExplanation;
