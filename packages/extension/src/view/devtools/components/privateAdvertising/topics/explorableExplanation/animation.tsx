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
import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import { topicsAnimation } from './topicsAnimation';

interface AnimationProps {
  epoch: { datetime: string; website: string; topics: string[] }[];
  siteAdTechs: Record<string, string[]>;
  handleUserVisit: (visitIndex: number) => void;
  isPlaying: boolean;
  resetAnimation: boolean;
  speedMultiplier: number;
}

const Animation = ({
  epoch,
  siteAdTechs,
  handleUserVisit,
  isPlaying,
  resetAnimation,
  speedMultiplier,
}: AnimationProps) => {
  const node = useRef(null);
  const [togglePlayCallback, setTogglePlayCallback] =
    useState<(state: boolean) => void>();
  const [resetCallback, setResetCallback] = useState<() => void>();
  const [speedMultiplierCallback, setSpeedMultiplierCallback] =
    useState<(speed: number) => void>();

  useEffect(() => {
    const tAnimation = (p: p5) => {
      const { togglePlay, reset, updateSpeedMultiplier } = topicsAnimation(
        p,
        epoch,
        siteAdTechs,
        handleUserVisit
      );

      setTogglePlayCallback(() => togglePlay);
      setResetCallback(() => reset);
      setSpeedMultiplierCallback(() => updateSpeedMultiplier);
    };

    const p = node.current ? new p5(tAnimation, node.current) : null;

    return () => {
      p?.remove();
    };
  }, [epoch, handleUserVisit, siteAdTechs]);

  useEffect(() => {
    togglePlayCallback?.(isPlaying);
  }, [isPlaying, togglePlayCallback]);

  useEffect(() => {
    if (resetAnimation) {
      resetCallback?.();
    }
  }, [resetAnimation, resetCallback]);

  useEffect(() => {
    speedMultiplierCallback?.(speedMultiplier);
  }, [speedMultiplier, speedMultiplierCallback]);

  return <div ref={node} className="overflow-auto" />;
};

export default Animation;
