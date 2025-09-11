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
import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Main } from '@google-psat/ee-workflow';
import { updateSessionStorage } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import Context from './context';
import { ScenarioKeys } from './scenariosTypes';
import { scenarios } from './scenarios';

const Provider = ({ children }: PropsWithChildren) => {
  const [canvas, setCanvas] = useState<Main>();
  const [play, setPlay] = useState<boolean>(true);
  const [speed, _setSpeed] = useState<number>(1.5);
  const [currentScenarioKey, setCurrentScenarioKey] = useState<ScenarioKeys>(
    ScenarioKeys.REGISTRATION
  );
  const [currentStep, setCurrentStep] = useState<number>(-1);

  useEffect(() => {
    return () => {
      if (canvas) {
        canvas?.getP5Instance().remove();
        setCanvas(undefined);
      }
    };
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      updateSessionStorage(
        { currentScenarioKey, currentStep },
        'fedcm-explorable-explanation-state'
      );
    }
  }, [canvas, currentScenarioKey, currentStep]);

  const setIsPlaying = useCallback(
    (isPlaying: boolean) => {
      if (
        isPlaying &&
        currentScenarioKey === ScenarioKeys.SIGNOUT &&
        currentStep === scenarios.signout.steps.length - 1
      ) {
        canvas?.reset();
        setCurrentScenarioKey(ScenarioKeys.REGISTRATION);
        setCurrentStep(-1);
      }

      setPlay(isPlaying);

      canvas?.togglePause(!isPlaying);
    },
    [canvas, currentScenarioKey, currentStep]
  );

  const setSpeed = useCallback(
    (_speed: number) => {
      _setSpeed(_speed);
      canvas?.updateSpeed(_speed);
    },
    [canvas]
  );

  const nextStep = useCallback(() => {
    canvas?.stepNext();
    setIsPlaying(false);
  }, [canvas, setIsPlaying]);

  const prevStep = useCallback(() => {
    canvas?.stepBack();
    setIsPlaying(false);
  }, [canvas, setIsPlaying]);

  const reset = useCallback(() => {
    canvas?.reset();
    setCurrentScenarioKey(ScenarioKeys.REGISTRATION);
    setCurrentStep(-1);
    setIsPlaying(false);
  }, [canvas, setIsPlaying]);

  const loadScenarioForInteractiveMode = useCallback(
    (scenarioKey: ScenarioKeys) => {
      setIsPlaying(false);

      const scenarioIndex = Object.values(ScenarioKeys).indexOf(scenarioKey);
      const currentScenarioIndex =
        Object.values(ScenarioKeys).indexOf(currentScenarioKey);

      if (scenarioIndex > currentScenarioIndex) {
        canvas?.loadNextCheckpoint(scenarioKey + '-0');
      } else if (scenarioIndex < currentScenarioIndex) {
        canvas?.loadPreviousCheckpoint(scenarioKey + '-0');
      }

      setCurrentScenarioKey(scenarioKey);
      setCurrentStep(-1);

      setIsPlaying(true);
    },
    [canvas, currentScenarioKey, setIsPlaying]
  );

  return (
    <Context.Provider
      value={{
        state: {
          play,
          speed,
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
          loadScenarioForInteractiveMode,
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
