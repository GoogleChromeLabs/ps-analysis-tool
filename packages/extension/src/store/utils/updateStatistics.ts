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
 * Internal dependencies
 */
import PRTStore from '../PRTStore';

const updateStatistics = (
  tabId: string,
  origin: string,
  nonZeroUint8Signal: boolean
) => {
  if (PRTStore.statistics.prtStatistics.localView[tabId]?.[origin]) {
    PRTStore.statistics.prtStatistics.localView[tabId][origin] = {
      totalTokens:
        (PRTStore.statistics.prtStatistics.localView[tabId][origin]
          ?.totalTokens ?? 0) + 1,
      nonZeroSignal:
        (PRTStore.statistics.prtStatistics.localView[tabId][origin]
          ?.nonZeroSignal ?? 0) + (nonZeroUint8Signal ? 1 : 0),
    };
  } else {
    PRTStore.statistics.prtStatistics.localView[tabId] = {
      ...PRTStore.statistics.prtStatistics.localView[tabId],
      [origin]: {
        totalTokens: 1,
        nonZeroSignal: nonZeroUint8Signal ? 1 : 0,
      },
    };
  }

  if (PRTStore.statistics.prtStatistics.globalView[origin]) {
    PRTStore.statistics.prtStatistics.globalView[origin] = {
      totalTokens:
        (PRTStore.statistics.prtStatistics.globalView[origin]?.totalTokens ??
          0) + 1,
      nonZeroSignal:
        (PRTStore.statistics.prtStatistics.globalView[origin]?.nonZeroSignal ??
          0) + (nonZeroUint8Signal ? 1 : 0),
    };
  } else {
    PRTStore.statistics.prtStatistics.globalView = {
      ...PRTStore.statistics.prtStatistics.globalView,
      [origin]: {
        totalTokens: 1,
        nonZeroSignal: nonZeroUint8Signal ? 1 : 0,
      },
    };
  }
};

export default updateStatistics;
