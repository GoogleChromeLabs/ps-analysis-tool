/*
 * Copyright 2023 Google LLC
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
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import Context from './context';
import { scenarios } from '../scenarios';
import { ScenarioKeys } from '../scenariosTypes';

const Provider = ({ children }: PropsWithChildren) => {
  const [currentScenarioKey, setCurrentScenarioKey] = useState<ScenarioKeys>(
    ScenarioKeys.REGISTRATION
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [messageCount, setMessageCount] = useState(0);

  const [autoAdvance, setAutoAdvance] = useState(false);

  const resetScenario = useCallback(() => {
    setCurrentStep(-1);
    setMessageCount(0);
  }, []);

  const incrementMessageCount = useCallback(() => {
    setMessageCount((prev) => prev + 1);
  }, []);

  const selectScenario = useCallback(
    (scenario: ScenarioKeys) => {
      setCurrentScenarioKey(scenario);
      resetScenario();
    },
    [resetScenario]
  );

  const nextStep = useCallback(() => {
    const scenario = scenarios[currentScenarioKey];

    setCurrentStep((prevStep) => prevStep + 1);

    if (currentStep >= scenario.steps.length) {
      const scenarioOrder = Object.values(ScenarioKeys);
      const currentIndex = scenarioOrder.indexOf(currentScenarioKey);

      if (currentIndex < scenarioOrder.length - 1) {
        setCurrentScenarioKey(scenarioOrder[currentIndex + 1]);
        setCurrentStep(-1);
      } else {
        setCurrentScenarioKey(ScenarioKeys.REGISTRATION);
        setCurrentStep(-1);
      }

      setMessageCount(0);
      return;
    }
  }, [currentScenarioKey, currentStep]);

  const autoAdvanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepRef = useRef(currentStep);
  const currentScenarioKeyRef = useRef(currentScenarioKey);

  useEffect(() => {
    currentStepRef.current = currentStep;
    currentScenarioKeyRef.current = currentScenarioKey;
  }, [currentStep, currentScenarioKey]);

  useEffect(() => {
    return () => {
      if (autoAdvanceIntervalRef.current) {
        clearInterval(autoAdvanceIntervalRef.current);
      }
    };
  }, []);

  const autoAdvanceHandler = useCallback(() => {
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current);
      autoAdvanceIntervalRef.current = null;
      setAutoAdvance(false);
      return;
    }

    setAutoAdvance(true);

    autoAdvanceIntervalRef.current = setInterval(() => {
      const scenario = scenarios[currentScenarioKeyRef.current];
      if (currentStepRef.current < scenario.steps.length - 1) {
        nextStep();
      } else {
        if (autoAdvanceIntervalRef.current) {
          clearInterval(autoAdvanceIntervalRef.current);
        }
        autoAdvanceIntervalRef.current = null;
        setAutoAdvance(false);
      }
    }, 1200);
  }, [nextStep]);

  return (
    <Context.Provider
      value={{
        state: {
          currentScenario: currentScenarioKey,
          currentStep,
          messageCount,
          autoAdvance,
        },
        actions: {
          resetCurrentScenario: resetScenario,
          selectScenario,
          incrementMessageCount,
          nextStep,
          autoAdvanceHandler,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
