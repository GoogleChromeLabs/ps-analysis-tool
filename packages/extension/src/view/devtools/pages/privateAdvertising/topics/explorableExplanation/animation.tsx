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
import { topicsAnimation } from '@google-psat/explorable-explanations';

interface AnimationProps {
  epoch: { datetime: string; website: string; topics: string[] }[];
  isAnimating: boolean;
  siteAdTechs: Record<string, string[]>;
  visitIndexStart: number;
  handleUserVisit: (visitIndex: number, updateTopics?: boolean) => void;
  isPlaying: boolean;
  resetAnimation: boolean;
  speedMultiplier: number;
  isInteractive: boolean;
  setPAActiveTab: (tabIndex: number) => void;
  setHighlightAdTech: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentVisitIndexCallback: React.Dispatch<
    React.SetStateAction<(() => number) | undefined>
  >;
}

const Animation = ({
  epoch,
  isAnimating,
  siteAdTechs,
  visitIndexStart,
  handleUserVisit,
  isPlaying,
  resetAnimation,
  speedMultiplier,
  isInteractive,
  setPAActiveTab,
  setHighlightAdTech,
  setCurrentVisitIndexCallback,
}: AnimationProps) => {
  const node = useRef(null);
  const [togglePlayCallback, setTogglePlayCallback] =
    useState<(state: boolean) => void>();
  const [resetCallback, setResetCallback] = useState<() => void>();
  const [speedMultiplierCallback, setSpeedMultiplierCallback] =
    useState<(speed: number) => void>();
  const animationRef = useRef(isAnimating);

  useEffect(() => {
    // Using the useRef hook to store the current value of isAnimating because the animation should not be re-rendered when the value of isAnimating changes.
    animationRef.current = isAnimating;
  }, [isAnimating, visitIndexStart]);

  useEffect(() => {
    const tAnimation = (p: p5) => {
      const { togglePlay, reset, updateSpeedMultiplier, getCurrentVisitIndex } =
        topicsAnimation(
          p,
          epoch,
          animationRef.current,
          siteAdTechs,
          visitIndexStart,
          animationRef.current
            ? handleUserVisit
            : (idx: number) => handleUserVisit(idx, false),
          setHighlightAdTech,
          isInteractive
        );

      setTogglePlayCallback(() => togglePlay);
      setResetCallback(() => reset);
      setSpeedMultiplierCallback(() => updateSpeedMultiplier);
      setCurrentVisitIndexCallback(() => getCurrentVisitIndex);
    };

    const p = node.current ? new p5(tAnimation, node.current) : null;

    return () => {
      p?.remove();
    };
  }, [
    epoch,
    handleUserVisit,
    isInteractive,
    setCurrentVisitIndexCallback,
    setHighlightAdTech,
    setPAActiveTab,
    siteAdTechs,
    visitIndexStart,
  ]);

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

  return (
    <div className="relative h-full">
      <div ref={node} className="overflow-auto bg-white h-full" />
      <div
        id="loading-text-cover"
        className="absolute top-0 left-0 w-20 h-10 bg-white z-50"
      />
    </div>
  );
};

export default Animation;
