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
import type { TopicsTableType } from '../topicsTable';

export type TopicsTableData = Record<number, TopicsTableType[]>;

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

export type SetTopicsTableDataAction = {
  type: 'setTopicsTableData';
  payload: {
    topicsTableData: TopicsTableData;
  };
};

export type SetHighlightAdTechAction = {
  type: 'setHighlightAdTech';
  payload: {
    highlightAdTech: string | null;
  };
};

export type SetActiveEpochAction = {
  type: 'setActiveEpoch';
  payload: {
    activeEpoch: number;
  };
};

export type SetIsPlayAction = {
  type: 'setIsPlaying';
  payload: {
    isPlaying: boolean;
  };
};

export type SetIsInteractiveAction = {
  type: 'setIsInteractive';
  payload: {
    isInteractive: boolean;
  };
};

export type SetSliderStepAction = {
  type: 'setSliderStep';
  payload: {
    sliderStep: number;
  };
};

export type ResetAction = {
  type: 'reset';
};

export type SetSiteAdTechsAction = {
  type: 'setSiteAdTechs';
  payload: {
    siteAdTechs: Record<string, string[]>;
  };
};

export type SetInitialStateAction = {
  type: 'setInitialState';
  payload: {
    initialState: Partial<TopicsExplorableExplanationState>;
  };
};

export type SetEpochSiteVisitedAction = {
  type: 'setEpochSiteVisited';
  payload: {
    epochIndex: number;
    siteIndex: number;
  };
};

export type SetHasAnimationFinishedAction = {
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
