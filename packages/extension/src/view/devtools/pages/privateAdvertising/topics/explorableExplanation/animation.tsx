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
import { TopicsAnimation } from '@google-psat/explorable-explanations';

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
  const animationRef = useRef(isAnimating);
  const loadingTextCoverRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<TopicsAnimation | null>(null);

  useEffect(() => {
    // Using the useRef hook to store the current value of isAnimating because the animation should not be re-rendered when the value of isAnimating changes.
    animationRef.current = isAnimating;
  }, [isAnimating, visitIndexStart]);

  const onAnimationReady = () => {
    if (loadingTextCoverRef.current) {
      loadingTextCoverRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    if (animation) {
      setCurrentVisitIndexCallback(() => animation.getCurrentVisitIndex);
      animation.start();
    }
  }, [animation, setCurrentVisitIndexCallback]);

  useEffect(() => {
    const init = (p: p5) => {
      if (loadingTextCoverRef.current) {
        loadingTextCoverRef.current.style.display = 'block';
      }
      const instance = new TopicsAnimation({
        p,
        epoch,
        isAnimating: animationRef.current,
        siteAdTechs,
        visitIndexStart,
        handleUserVisit: animationRef.current
          ? handleUserVisit
          : (idx: number) => handleUserVisit(idx, false),
        setHighlightAdTech,
        onReady: onAnimationReady,
      });
      setAnimation(instance);
    };

    const p = node.current ? new p5(init, node.current) : null;

    return () => {
      p?.remove();
    };
  }, [
    epoch,
    handleUserVisit,
    setCurrentVisitIndexCallback,
    setHighlightAdTech,
    setPAActiveTab,
    siteAdTechs,
    visitIndexStart,
  ]);

  useEffect(() => {
    animation?.togglePlay(isPlaying);
  }, [isPlaying, animation]);

  useEffect(() => {
    if (resetAnimation) {
      animation?.reset();
    }
  }, [resetAnimation, animation]);

  useEffect(() => {
    animation?.updateSpeedMultiplier(speedMultiplier);
  }, [speedMultiplier, animation]);

  useEffect(() => {
    animation?.reset();
    animation?.setInteractiveMode(isInteractive);
    animation?.togglePlay(isPlaying);
  }, [isInteractive, animation, isPlaying]);

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
