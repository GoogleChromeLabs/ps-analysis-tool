/*
 * Copyright 2025 Google LLC
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { DraggableTray } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */

import { BrowserStep, SequenceDiagram, Timeline } from './components';
import { useStore } from './store';
import Header from './header';
import { scenarios } from './store/scenarios';

interface PanelProps {
  setStepExplanation: (explanation: string) => void;
  setScenarioTitle: (title: string) => void;
  setScenarioExplanation: (explanation: string) => void;
}

const Panel = ({
  setStepExplanation,
  setScenarioTitle,
  setScenarioExplanation,
}: PanelProps) => {
  const {
    play,
    setPlay,
    interactiveMode,
    interactiveModeHandler,
    nextStep,
    reset,
    currentScenario,
  } = useStore(({ state, actions }) => ({
    play: state.play,
    setPlay: actions.setPlay,
    interactiveMode: state.interactiveMode,
    interactiveModeHandler: actions.interactiveModeHandler,
    nextStep: actions.nextStep,
    reset: actions.resetCurrentScenario,
    currentScenario: state.currentScenario,
  }));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const draggableTrayRef = useRef({
    isCollapsed,
    setIsCollapsed,
  });
  const [sliderStep, setSliderStep] = useState(1);
  const [historyCount, setHistoryCount] = useState(0);

  const setPlaying = useCallback(() => {
    setPlay(!play);
  }, [play, setPlay]);

  const resetHandler = useCallback(() => {
    setPlay(false);
    setSliderStep(1);
    setHistoryCount(0);
    reset();
  }, [reset, setPlay]);

  useEffect(() => {
    const scenario = scenarios[currentScenario];
    setScenarioTitle(scenario.title);
    setScenarioExplanation(scenario.description);
  }, [currentScenario, setScenarioExplanation, setScenarioTitle]);

  const interactiveModeInterface = (
    <div>
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          checked={interactiveMode}
          onChange={interactiveModeHandler}
          className="hover:cursor-pointer"
        />
        <span className="whitespace-nowrap">Interactive Mode</span>
      </label>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        play={play}
        setPlay={setPlaying}
        sliderStep={sliderStep}
        setSliderStep={setSliderStep}
        historyCount={historyCount}
        reset={resetHandler}
        showNextPrevButtons={true}
        nextStep={nextStep}
        extraInterface={interactiveModeInterface}
      />
      <div className="flex-1 overflow-auto px-4 min-w-fit">
        <Timeline />
        <main className="flex flex-col gap-5 h-fit">
          <div
            className="flex flex-row gap-5 min-h-[500px]"
            id="visualization-container"
          >
            <BrowserStep setStepExplanation={setStepExplanation} />
            <SequenceDiagram />
          </div>
        </main>
      </div>
      <DraggableTray
        ref={draggableTrayRef}
        trayId="explorableExplanationFedcm"
        defaultHeight="170px"
      />
    </div>
  );
};

export default Panel;
