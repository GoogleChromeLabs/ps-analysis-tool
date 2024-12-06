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
  isAnimating: boolean;
  siteAdTechs: Record<string, string[]>;
  visitIndexStart: number;
  handleUserVisit: (visitIndex: number, updateTopics?: boolean) => void;
  isPlaying: boolean;
  resetAnimation: boolean;
  speedMultiplier: number;
  setPAActiveTab: (tabIndex: number) => void;
  setPAStorage: (content: string) => void;
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
  setPAActiveTab,
  setPAStorage,
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
  const visitIndexStartRef = useRef(visitIndexStart);

  useEffect(() => {
    // Using the useRef hook to store the current value of isAnimating because the animation should not be re-rendered when the value of isAnimating changes.
    animationRef.current = isAnimating;
    visitIndexStartRef.current = visitIndexStart;
  }, [isAnimating, visitIndexStart]);

  useEffect(() => {
    const tAnimation = (p: p5) => {
      const { togglePlay, reset, updateSpeedMultiplier, getCurrentVisitIndex } =
        topicsAnimation(
          p,
          epoch,
          animationRef.current,
          siteAdTechs,
          visitIndexStartRef.current,
          animationRef.current
            ? handleUserVisit
            : (idx: number) => handleUserVisit(idx, false),
          setHighlightAdTech
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
    setCurrentVisitIndexCallback,
    setHighlightAdTech,
    setPAActiveTab,
    setPAStorage,
    siteAdTechs,
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

  return <div ref={node} className="overflow-auto" />;
};

export default Animation;
