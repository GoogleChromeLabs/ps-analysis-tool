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
import { useEffect, useState } from 'react';
import { scenarios } from '../scenarios';
import { ScenarioKeys } from '../scenariosTypes';
import { useStore } from '../store';

/**
 *
 */
export default function ScenarioInfoPanel() {
  const {
    currentScenario,
    currentStep,
    resetCurrentScenario,
    nextStep,
    autoAdvance,
    autoAdvanceHandler,
  } = useStore(({ state, actions }) => ({
    currentScenario: state.currentScenario,
    currentStep: state.currentStep,
    resetCurrentScenario: actions.resetCurrentScenario,
    nextStep: actions.nextStep,
    autoAdvance: state.autoAdvance,
    autoAdvanceHandler: actions.autoAdvanceHandler,
  }));

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const scenario = scenarios[currentScenario];
    setTitle(scenario.title);
    setDescription(scenario.description);
  }, [currentScenario]);

  const controlButtonText =
    currentStep === -1
      ? 'Start Flow'
      : currentStep === scenarios[currentScenario].steps.length - 1 &&
        Object.values(ScenarioKeys).indexOf(currentScenario) ===
          Object.values(ScenarioKeys).length - 1
      ? 'Restart Demo'
      : 'Next Step';

  const autoAdvanceText = autoAdvance ? 'Stop Auto Advance' : 'Auto Advance';

  return (
    <div id="scenario-info-panel">
      <h2 id="scenario-title">{title ?? ''}</h2>
      <p id="scenario-description">{description}</p>
      <div className="control-toolbar">
        <button
          id="auto-advance"
          className="control-button"
          onClick={autoAdvanceHandler}
        >
          {autoAdvanceText}
        </button>
        <button id="next-step" className="control-button" onClick={nextStep}>
          {controlButtonText}
        </button>
        <button
          id="reset-scenario"
          className="control-button"
          onClick={resetCurrentScenario}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
