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
import React from 'react';

interface SliderProps {
  sliderStep: number;
  setSliderStep: React.Dispatch<React.SetStateAction<number>>;
}

const Slider = ({ sliderStep, setSliderStep }: SliderProps) => {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="steps-range"
        className="text-raisin-black dark:text-bright-gray"
      >
        Speed:
      </label>
      <input
        type="range"
        min={0.5}
        max={2}
        step={0.5}
        value={sliderStep}
        onChange={(event) => setSliderStep(Number(event.target.value))}
        className="w-full h-1 bg-baby-blue-eyes rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default Slider;
