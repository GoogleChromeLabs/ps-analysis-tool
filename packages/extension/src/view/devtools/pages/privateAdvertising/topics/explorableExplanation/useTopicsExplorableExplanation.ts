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
import { useEffect, useReducer, useRef } from 'react';
import { updateSessionStorage, getSessionStorage } from '@google-psat/common';
import {
  assignAdtechsToSites,
  createEpochs,
  adtechs,
  websites,
  // @ts-ignore package does not have types
} from '@google-psat/explorable-explanations';

/**
 * Internal dependencies.
 */
import type { TopicsTableType } from './topicsTable';

type TopicsTableData = Record<number, TopicsTableType[]>;

export type Epoch = {
  webVisits: { website: string; datetime: string; topics: string[] }[];
};

export type TopicsExplorableExplanationState = {
  isTabStorageLoaded: boolean;
  isSessionStorageLoaded: boolean;
  epochs: Epoch[];
  topicsTableData: TopicsTableData;
  highlightAdTech: string | null;
  completedEpochs: Set<number>;
  activeEpoch: number;
  isPlaying: boolean;
  isInteractive: boolean;
  sliderStep: number;
  siteAdTechs: Record<string, string[]>;
  epochSiteVisited: Record<number, Set<number>>;
  hasAnimationFinished: boolean;
};

type SetTopicsTableDataAction = {
  type: 'setTopicsTableData';
  payload: {
    topicsTableData: TopicsTableData;
  };
};

type SetHighlightAdTechAction = {
  type: 'setHighlightAdTech';
  payload: {
    highlightAdTech: string | null;
  };
};

type SetActiveEpochAction = {
  type: 'setActiveEpoch';
  payload: {
    activeEpoch: number;
  };
};

type SetIsPlayAction = {
  type: 'setIsPlaying';
  payload: {
    isPlaying: boolean;
  };
};

type SetIsInteractiveAction = {
  type: 'setIsInteractive';
  payload: {
    isInteractive: boolean;
  };
};

type SetSliderStepAction = {
  type: 'setSliderStep';
  payload: {
    sliderStep: number;
  };
};

type ResetAction = {
  type: 'reset';
};

type SetSiteAdTechsAction = {
  type: 'setSiteAdTechs';
  payload: {
    siteAdTechs: Record<string, string[]>;
  };
};

type SetInitialStateAction = {
  type: 'setInitialState';
  payload: {
    initialState: Partial<TopicsExplorableExplanationState>;
  };
};

type SetEpochSiteVisitedAction = {
  type: 'setEpochSiteVisited';
  payload: {
    epochIndex: number;
    siteIndex: number;
  };
};

type SetHasAnimationFinishedAction = {
  type: 'setHasAnimationFinished';
  payload: {
    hasAnimationFinished: boolean;
  };
};

export type TopicsExplorableExplanationAction =
  | SetTopicsTableDataAction
  | SetHighlightAdTechAction
  | SetActiveEpochAction
  | SetIsPlayAction
  | SetIsInteractiveAction
  | SetSliderStepAction
  | ResetAction
  | SetSiteAdTechsAction
  | SetInitialStateAction
  | SetEpochSiteVisitedAction
  | SetHasAnimationFinishedAction;

const initialState: TopicsExplorableExplanationState = {
  isTabStorageLoaded: false,
  isSessionStorageLoaded: false,
  epochs: [],
  topicsTableData: {},
  highlightAdTech: null,
  completedEpochs: new Set(),
  activeEpoch: 0,
  isPlaying: false,
  isInteractive: false,
  sliderStep: 1,
  siteAdTechs: {},
  // TODO: set based on number of epochs and use array instead of object
  epochSiteVisited: {
    0: new Set(),
    1: new Set(),
    2: new Set(),
    3: new Set(),
  },
  hasAnimationFinished: false,
};

const EE_TAB_INDEX = 1; // use for tab storage
const STORAGE_KEY = 'topicsExplorableExplanation'; // session storage

export const useTopicsExplorableExplanation = (
  tabStorage: string[],
  setPAStorage: (data: string, index?: number) => void
) => {
  const [topicsState, topicsDispatch] = useReducer(
    (
      state: TopicsExplorableExplanationState,
      action: TopicsExplorableExplanationAction
    ) => {
      switch (action.type) {
        case 'setTopicsTableData':
          return { ...state, topicsTableData: action.payload.topicsTableData };
        case 'setHighlightAdTech':
          return { ...state, highlightAdTech: action.payload.highlightAdTech };
        case 'setActiveEpoch':
          return {
            ...state,
            activeEpoch: action.payload.activeEpoch,
            epochSiteVisited: {
              ...state.epochSiteVisited,
              [action.payload.activeEpoch]: new Set<number>(),
            },
          };
        case 'setIsPlaying':
          return { ...state, isPlaying: action.payload.isPlaying };
        case 'setIsInteractive':
          return {
            ...state,
            isInteractive: action.payload.isInteractive,
            isPlaying: !action.payload.isInteractive,
            activeEpoch: 0,
            // reset visited sites when interactive mode is toggled
            epochSiteVisited: initialState.epochSiteVisited,
            topicsTableData: initialState.topicsTableData,
          };
        case 'setSliderStep':
          return { ...state, sliderStep: action.payload.sliderStep };
        case 'setSiteAdTechs':
          return { ...state, siteAdTechs: action.payload.siteAdTechs };
        case 'setEpochSiteVisited':
          return setEpochSiteVisited(state, action);
        case 'setHasAnimationFinished':
          return {
            ...state,
            hasAnimationFinished: action.payload.hasAnimationFinished,
          };
        case 'setInitialState':
          return {
            ...state,
            ...action.payload.initialState,
          };
        case 'reset':
          return {
            ...state,
            epochs: JSON.parse(tabStorage[EE_TAB_INDEX] || '{}').epochs,
            activeEpoch: 0,
            epochSiteVisited: {
              0: new Set(),
              1: new Set(),
              2: new Set(),
              3: new Set(),
            } as Record<number, Set<number>>,
            completedEpochs: new Set<number>(),
            topicsTableData: {},
            highlightAdTech: null,
            isPlaying: !state.isInteractive,
          };
        default:
          return state;
      }
    },
    initialState
  );

  // loads initial state from session storage if it exists
  const storageLoaded = useRef(false);
  useEffect(() => {
    // only load initial state once
    if (storageLoaded.current) {
      return;
    }

    const storage = tabStorage[EE_TAB_INDEX] || '{}';

    const {
      siteAdTechs,
      topicsTableData: tableData,
      epochSiteVisited,
      activeEpoch,
      completedEpochs,
      epochs,
    } = JSON.parse(storage || '{}');

    topicsDispatch({
      type: 'setInitialState',
      payload: {
        initialState: {
          siteAdTechs: siteAdTechs || assignAdtechsToSites(websites, adtechs),
          topicsTableData: tableData || topicsState.topicsTableData,
          epochSiteVisited: Object.fromEntries(
            Object.entries(
              epochSiteVisited || topicsState.epochSiteVisited
              // @ts-expect-error value comes from Stringified Set
            ).map(([key, value]) => [key, new Set([...value])])
          ),
          activeEpoch: activeEpoch || topicsState.activeEpoch,
          completedEpochs: new Set(
            completedEpochs || topicsState.completedEpochs
          ),
          epochs: epochs || createEpochs(),
        },
      },
    });
    storageLoaded.current = true;
  }, [
    tabStorage,
    topicsState.activeEpoch,
    topicsState.completedEpochs,
    topicsState.epochSiteVisited,
    topicsState.topicsTableData,
  ]);

  // keep state in sync with tab storage
  useEffect(() => {
    if (!storageLoaded.current) {
      return;
    }

    setPAStorage(
      JSON.stringify({
        topicsTableData: topicsState.topicsTableData,
        highlightAdTech: topicsState.highlightAdTech,
        epochSiteVisited: Object.fromEntries(
          Object.entries(topicsState.epochSiteVisited).map(([key, value]) => [
            key,
            Array.from(value),
          ])
        ),
        activeEpoch: topicsState.activeEpoch,
        completedEpochs: Array.from(topicsState.completedEpochs),
        epochs: topicsState.epochs,
      }),
      EE_TAB_INDEX
    );
  }, [
    setPAStorage,
    topicsState.activeEpoch,
    topicsState.completedEpochs,
    topicsState.epochSiteVisited,
    topicsState.epochs,
    topicsState.highlightAdTech,
    topicsState.topicsTableData,
  ]);

  // loads initial state from session storage if it exists
  const hasDataBeenFetchedFromSessionStorage = useRef<boolean>(false);
  useEffect(() => {
    (async () => {
      if (hasDataBeenFetchedFromSessionStorage.current) {
        return;
      }

      const data = (await getSessionStorage(STORAGE_KEY)) || {};

      topicsDispatch({
        type: 'setInitialState',
        payload: {
          initialState: data,
        },
      });

      hasDataBeenFetchedFromSessionStorage.current = true;
    })();
  }, []);

  // keep state in sync with session storage
  useEffect(() => {
    (async () => {
      if (!hasDataBeenFetchedFromSessionStorage.current) {
        return;
      }

      await updateSessionStorage(
        {
          isInteractive: topicsState.isInteractive,
          sliderStep: topicsState.sliderStep,
        },
        STORAGE_KEY
      );
    })();
  }, [topicsState.isInteractive, topicsState.sliderStep]);

  return [topicsState, topicsDispatch] as const;
};

const setEpochSiteVisited = (
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

const calculateTopicsTableData = (
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
