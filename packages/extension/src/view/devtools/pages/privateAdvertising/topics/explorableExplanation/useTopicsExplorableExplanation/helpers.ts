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
 * Internal dependencies.
 */
import type {
  SetEpochSiteVisitedAction,
  TopicsExplorableExplanationState,
} from './types';

export const setEpochSiteVisited = (
  state: TopicsExplorableExplanationState,
  action: SetEpochSiteVisitedAction
) => {
  const { epochIndex, siteIndex } = action.payload;
  const currentEpoch = state.epochs[state.activeEpoch];
  const visited = new Set([...state.epochSiteVisited[epochIndex], siteIndex]);

  // the animation has the concept of "user visit" and "user visit done"
  // it means that when index [6] is visited, [5] is actually done, so we need to add 1 to the length
  const isCompleted = visited.size === currentEpoch.webVisits.length + 1;

  const hasSiteBeenVisited = state.epochSiteVisited[epochIndex].has(siteIndex);
  const isLastVisitDone = siteIndex === currentEpoch.webVisits.length;

  // only calculate topics table data for unvisited or not done sites
  const topicsTableData =
    hasSiteBeenVisited || isLastVisitDone
      ? state.topicsTableData
      : calculateTopicsTableData(state, epochIndex, siteIndex);

  return {
    ...state,
    topicsTableData,
    completedEpochs: isCompleted
      ? new Set([...state.completedEpochs, epochIndex])
      : state.completedEpochs,
    epochSiteVisited: {
      ...state.epochSiteVisited,
      [epochIndex]: visited,
    },
  };
};

export const calculateTopicsTableData = (
  state: TopicsExplorableExplanationState,
  epochIndex: number,
  siteIndex: number
) => {
  const { siteAdTechs, topicsTableData } = state;
  const epoch = state.epochs[epochIndex];
  const { website, topics } = epoch.webVisits[siteIndex];

  const newTopicsTableData = topics.reduce(
    (acc, topic) => {
      const existingTopic = acc.find((t) => t.topicName === topic);
      if (existingTopic) {
        existingTopic.count += 1;
        existingTopic.observedByContextDomains = [
          ...new Set([
            ...existingTopic.observedByContextDomains,
            ...siteAdTechs[website],
          ]),
        ];
      } else {
        acc.push({
          topicName: topic,
          count: 1,
          observedByContextDomains: siteAdTechs[website] || [],
        });
      }
      return acc;
    },
    [...(topicsTableData[epochIndex] || [])]
  );

  return {
    ...state.topicsTableData,
    [epochIndex]: newTopicsTableData,
  };
};
