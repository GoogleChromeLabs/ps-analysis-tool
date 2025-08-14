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
import { useCallback, useRef, useState } from 'react';
import { DraggableTray } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';

const Panel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const draggableTrayRef = useRef({
    isCollapsed,
    setIsCollapsed,
  });
  const [play, setPlay] = useState(false);
  const [sliderStep, setSliderStep] = useState(1);
  const [historyCount, setHistoryCount] = useState(0);

  const setPlaying = useCallback(() => {
    setPlay((prevState) => {
      return !prevState;
    });
  }, []);

  const resetHandler = useCallback(() => {
    setPlay(false);
    setSliderStep(1);
    setHistoryCount(0);
  }, []);

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
      />
      <div className="flex-1"></div>
      <DraggableTray ref={draggableTrayRef} trayId="explorableExplanation" />
    </div>
  );
};

export default Panel;
