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
// @ts-ignore package does not have types
import { TopicsAnimation } from '@google-psat/explorable-explanations';
import p5 from '../../../../../../utils/p5';

/**
 * Internal dependencies
 */
import type {
  TopicsExplorableExplanationAction,
  TopicsExplorableExplanationState,
} from './useTopicsExplorableExplanation';

const Animation = ({
  topicsState,
  topicsDispatch,
}: {
  topicsState: TopicsExplorableExplanationState;
  topicsDispatch: React.Dispatch<TopicsExplorableExplanationAction>;
}) => {
  const node = useRef<HTMLDivElement>(null);
  const loadingTextCoverRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<TopicsAnimation | null>(null);

  const { isPlaying, epochSiteVisited, epochs, activeEpoch } = topicsState;

  const sitesVisited = epochSiteVisited[activeEpoch];
  const currentVisitedIndex = sitesVisited.size;
  const currentEpoch = epochs[activeEpoch];

  const handleUserVisit = useCallback(
    (visitIndex: number) => {
      topicsDispatch({
        type: 'setEpochSiteVisited',
        payload: { epochIndex: topicsState.activeEpoch, siteIndex: visitIndex },
      });
    },
    [topicsDispatch, topicsState.activeEpoch]
  );

  const handleHighlightAdTech = useCallback(
    (highlightAdTech: string | null) => {
      topicsDispatch({
        type: 'setHighlightAdTech',
        payload: { highlightAdTech },
      });
    },
    [topicsDispatch]
  );

  useEffect(() => {
    const init = (sketch: typeof p5) => {
      const instance = new TopicsAnimation({
        p: sketch,
        onReady: () => {
          if (loadingTextCoverRef.current) {
            loadingTextCoverRef.current.remove();
          }
        },
      });
      setAnimation(instance);
    };

    // keep only one instance of p5
    if (node.current && !animation) {
      // eslint-disable-next-line no-new
      new p5(init, node.current);
    }
  }, [topicsDispatch, topicsState.activeEpoch, animation, handleUserVisit]);

  useEffect(() => {
    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, [animation]);

  /* sync animation with state/callbacks - start */
  useEffect(() => {
    animation?.togglePlay(isPlaying);
  }, [isPlaying, animation]);

  useEffect(() => {
    animation?.setCurrentVisitIndex(currentVisitedIndex);
  }, [currentVisitedIndex, animation]);

  useEffect(() => {
    if (currentEpoch) {
      animation?.setWebVisits(currentEpoch.webVisits);
    }
  }, [currentEpoch, animation]);

  useEffect(() => {
    animation?.setSiteAdTechs(topicsState.siteAdTechs);
  }, [topicsState.siteAdTechs, animation]);

  useEffect(() => {
    animation?.setInteractiveMode(topicsState.isInteractive);
  }, [topicsState.isInteractive, animation]);

  useEffect(() => {
    animation?.updateSpeedMultiplier(topicsState.sliderStep);
  }, [topicsState.sliderStep, animation]);

  useEffect(() => {
    animation?.setHandleHighlighTech(handleHighlightAdTech);
  }, [animation, handleHighlightAdTech]);

  useEffect(() => {
    animation?.setHandleUserVisit(handleUserVisit);
  }, [animation, handleUserVisit]);

  useEffect(() => {
    animation?.setInspectedCircles(sitesVisited);
  }, [animation, sitesVisited]);
  /* sync animation with state/callbacks - end */

  return (
    <div className="relative h-full">
      <div ref={node} className="overflow-auto bg-white h-full" />
      {/* used for covering loading text when loading */}
      <div
        ref={loadingTextCoverRef}
        id="loading-text-cover"
        className="absolute top-0 left-0 w-20 h-10 bg-white z-50"
      />
    </div>
  );
};

export default memo(Animation);
