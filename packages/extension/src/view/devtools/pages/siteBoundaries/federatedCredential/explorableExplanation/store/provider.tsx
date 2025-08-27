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
import { useCallback, useState, type PropsWithChildren } from 'react';
import type { Main } from '@google-psat/ee-workflow';

/**
 * Internal dependencies.
 */
import Context from './context';
import { ScenarioKeys } from './scenariosTypes';

const Provider = ({ children }: PropsWithChildren) => {
  const [canvas, setCanvas] = useState<Main>();
  const [play, setPlay] = useState(false);
  const [speed, _setSpeed] = useState(1.5);
  const [interactiveMode, _setInteractiveMode] = useState(false);
  const [currentScenarioKey, setCurrentScenarioKey] = useState<ScenarioKeys>(
    ScenarioKeys.REGISTRATION
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [interactiveModeLoadedScenarios, setInteractiveModeLoadedScenarios] =
    useState<Set<string>>(new Set());

  const setIsPlaying = useCallback(
    (isPlaying: boolean) => {
      setPlay(isPlaying);

      canvas?.togglePause(!isPlaying);
    },
    [canvas]
  );

  const setSpeed = useCallback(
    (_speed: number) => {
      _setSpeed(_speed);
      canvas?.updateSpeed(_speed);
    },
    [canvas]
  );

  const nextStep = useCallback(() => {
    canvas?.loadNextCheckpoint();
  }, [canvas]);

  const prevStep = useCallback(() => {
    canvas?.loadPreviousCheckpoint();
  }, [canvas]);

  const reset = useCallback(() => {
    canvas?.reset();
    setCurrentScenarioKey(ScenarioKeys.REGISTRATION);
    setCurrentStep(-1);
    setIsPlaying(false);
  }, [canvas, setIsPlaying]);

  const setInteractiveMode = useCallback(
    (_interactiveMode: boolean) => {
      _setInteractiveMode(_interactiveMode);
      canvas?.setUsingHelperQueue(_interactiveMode);

      if (!_interactiveMode) {
        setIsPlaying(false);
        setCurrentScenarioKey(ScenarioKeys.REGISTRATION);
        setCurrentStep(-1);
      }
    },
    [canvas, setIsPlaying]
  );

  const loadScenarioForInteractiveMode = useCallback(
    (id: string, scenarioKey: ScenarioKeys, shouldRedraw: boolean) => {
      if (!canvas?.isPaused()) {
        return;
      }

      if (shouldRedraw) {
        canvas?.reDrawAll();
      }

      canvas?.loadCheckpointToHelper(id);

      setInteractiveModeLoadedScenarios((prev) => {
        const newSet = new Set(prev);
        newSet.add(scenarioKey);
        return newSet;
      });

      setCurrentScenarioKey(scenarioKey);
      setCurrentStep(-1);

      if (interactiveModeLoadedScenarios.has(scenarioKey)) {
        canvas?.loadAnimatorPartAndDraw(scenarioKey);
      }
    },
    [canvas, interactiveModeLoadedScenarios]
  );

  const hasLoadedForInteractiveMode = useCallback(
    (scenarioKey: ScenarioKeys) => {
      return interactiveModeLoadedScenarios.has(scenarioKey);
    },
    [interactiveModeLoadedScenarios]
  );

  return (
    <Context.Provider
      value={{
        state: {
          play,
          speed,
          interactiveMode,
          currentScenarioKey,
          currentStep,
        },
        actions: {
          setCanvas,
          setIsPlaying,
          reset,
          nextStep,
          prevStep,
          setSpeed,
          setInteractiveMode,
          loadScenarioForInteractiveMode,
          hasLoadedForInteractiveMode,
          setCurrentScenarioKey,
          setCurrentStep,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
