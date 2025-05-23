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
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { TopicsAnimation } from '@google-psat/explorable-explanations';

const epochTransitionDelay = 2000;

interface AnimationProps {
  epoch: { datetime: string; website: string; topics: string[] }[];
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
  isCompleted: boolean;
}

const Animation = ({
  epoch,
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
  isCompleted,
}: AnimationProps) => {
  const node = useRef(null);
  const loadingTextCoverRef = useRef<HTMLDivElement>(null);
  // animation instance
  const [animation, setAnimation] = useState<TopicsAnimation | null>(null);

  const _handleUserVisit = useCallback(
    (visitIndex: number) => {
      setTimeout(
        () => {
          handleUserVisit(visitIndex, !isCompleted);
        },
        visitIndex === epoch.length ? epochTransitionDelay : 0
      );
    },
    [epoch.length, handleUserVisit, isCompleted]
  );

  useEffect(() => {
    if (animation) {
      setCurrentVisitIndexCallback(() => animation.getCurrentVisitIndex);
      animation.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  useEffect(() => {
    if (animation) {
      animation.setCurrentVisitIndex(visitIndexStart);
    }
  }, [animation, visitIndexStart]);

  // initialize animation instance
  useEffect(() => {
    const init = (p: p5) => {
      // hide loading text cover while animation is loading
      if (loadingTextCoverRef.current) {
        loadingTextCoverRef.current.style.display = 'block';
      }
      const instance = new TopicsAnimation({
        p,
        epoch,
        siteAdTechs,
        handleUserVisit: _handleUserVisit,
        setHighlightAdTech,
        onReady: () => {
          if (loadingTextCoverRef.current) {
            loadingTextCoverRef.current.style.display = 'none';
          }
        },
      });
      setAnimation(instance);
    };

    const p = node.current ? new p5(init, node.current) : null;

    return () => {
      p?.remove();
    };
  }, [
    _handleUserVisit,
    epoch,
    setCurrentVisitIndexCallback,
    setHighlightAdTech,
    setPAActiveTab,
    siteAdTechs,
  ]);

  /* sync animation with state start */
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
  }, [isInteractive, animation]);

  // useEffect(() => {
  //   animation?.setVisitIndexStart(visitIndexStart);
  // }, [visitIndexStart, animation]);

  useEffect(() => {
    if (isCompleted) {
      animation?.setVisitIndexStart(epoch.length - 1);
    }
  }, [isCompleted, animation, epoch]);
  /* sync animation with state end */

  return (
    <div className="relative h-full">
      <div ref={node} className="overflow-auto bg-white h-full" />
      <div
        ref={loadingTextCoverRef}
        id="loading-text-cover"
        className="absolute top-0 left-0 w-20 h-10 bg-white z-50"
      />
    </div>
  );
};

export default memo(Animation);
