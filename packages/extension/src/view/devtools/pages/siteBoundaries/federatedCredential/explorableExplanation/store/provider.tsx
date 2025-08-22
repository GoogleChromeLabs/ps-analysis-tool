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

const Provider = ({ children }: PropsWithChildren) => {
  const [canvas, setCanvas] = useState<Main>();
  const [play, setPlay] = useState(false);
  const [speed, _setSpeed] = useState(1.5);

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
  }, [canvas]);

  return (
    <Context.Provider
      value={{
        state: {
          play,
          speed,
        },
        actions: {
          setCanvas,
          setIsPlaying,
          reset,
          nextStep,
          prevStep,
          setSpeed,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
