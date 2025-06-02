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
import type {
  TopicsExplorableExplanationState,
  TopicsExplorableExplanationAction,
} from './types';
import { setEpochSiteVisited } from './helpers';

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
            topicsTableData: state.isInteractive
              ? initialState.topicsTableData
              : state.topicsTableData,
            activeEpoch: action.payload.activeEpoch,
            epochSiteVisited: state.isInteractive
              ? {
                  ...state.epochSiteVisited,
                  [action.payload.activeEpoch]: new Set<number>(),
                }
              : state.epochSiteVisited,
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
            completedEpochs: initialState.completedEpochs,
            hasAnimationFinished: false,
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
            activeEpoch: 0,
            epochSiteVisited: initialState.epochSiteVisited,
            completedEpochs: initialState.completedEpochs,
            topicsTableData: initialState.topicsTableData,
            highlightAdTech: null,
            isPlaying: !state.isInteractive,
            hasAnimationFinished: false,
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
          isTabStorageLoaded: true,
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
          initialState: {
            ...data,
            isSessionStorageLoaded: true,
          },
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
