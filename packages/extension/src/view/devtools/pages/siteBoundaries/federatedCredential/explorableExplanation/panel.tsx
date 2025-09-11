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
import { useEffect, useRef, useState } from 'react';
import { DraggableTray } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { BrowserStep, SequenceDiagram, Timeline } from './components';
import Header from './header';
import { scenarios } from './store/scenarios';
import { ScenarioKeys } from './store/scenariosTypes';
import { useStore } from './store';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const draggableTrayRef = useRef({
    isCollapsed,
    setIsCollapsed,
  });

  const {
    currentStep,
    currentScenarioKey,
    setCurrentScenarioKey,
    setCurrentStep,
    setIsPlaying,
  } = useStore(({ state, actions }) => {
    return {
      currentScenarioKey: state.currentScenarioKey,
      currentStep: state.currentStep,
      setCurrentScenarioKey: actions.setCurrentScenarioKey,
      setCurrentStep: actions.setCurrentStep,
      setIsPlaying: actions.setIsPlaying,
    };
  });

  useEffect(() => {
    const scenario = scenarios[currentScenarioKey];
    setScenarioTitle(scenario.title);
    setScenarioExplanation(scenario.description);
  }, [currentScenarioKey, setScenarioExplanation, setScenarioTitle]);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { dispatchId } = customEvent.detail;

      if (!dispatchId) {
        return;
      }

      const [scenarioKey, stepIndex] = (dispatchId as string)
        .split('-')
        .slice(-2);

      setCurrentScenarioKey(scenarioKey as ScenarioKeys);
      setCurrentStep(Number(stepIndex));
    };

    const animatorListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { animatorId } = customEvent.detail;

      const idx = Object.keys(scenarios).indexOf(animatorId);
      if (idx === Object.keys(scenarios).length - 1) {
        setIsPlaying(false);
        return;
      }

      const nextScenarioKey = Object.keys(scenarios)[idx + 1] as ScenarioKeys;

      setCurrentScenarioKey(nextScenarioKey);
      setCurrentStep(-1);
    };

    document.addEventListener('ee:dispatchId', listener);
    document.addEventListener('ee:animatorDraw', animatorListener);

    return () => {
      document.removeEventListener('ee:dispatchId', listener);
      document.removeEventListener('ee:animatorDraw', animatorListener);
    };
  }, [setCurrentScenarioKey, setCurrentStep, setIsPlaying]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 overflow-auto flex flex-col gap-2 pb-4">
        <Timeline currentScenarioKey={currentScenarioKey} />
        <main className="flex flex-col gap-5 h-fit">
          <div className="flex max-h-[450px]" id="visualization-container">
            <BrowserStep
              setStepExplanation={setStepExplanation}
              currentStep={currentStep}
              currentScenarioKey={currentScenarioKey}
            />
            <SequenceDiagram />
          </div>
        </main>
      </div>
      <DraggableTray
        ref={draggableTrayRef}
        trayId="explorableExplanationFedcm"
        defaultHeight="150px"
      />
    </div>
  );
};

export default Panel;
