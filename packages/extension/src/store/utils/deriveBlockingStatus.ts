/*
 * Copyright 2023 Google LLC
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
import type { CookieData } from '@ps-analysis-tool/common';

/**
 *
 * @param respEvents Response event array
 * @returns outbound blocking status
 */
function deriveInboundBlocking(
  respEvents: CookieData['networkEvents']['responseEvents']
): CookieData['blockingStatus']['inboundBlock'] {
  const numBlocked: number = respEvents.reduce((acc, event) => {
    if (event.blocked === null) {
      return acc;
    } else if (event.blocked) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  if (numBlocked === 0) {
    return false; // cookie is not blocked.
  } else if (0 < numBlocked && numBlocked < respEvents.length) {
    return null; // cookie may be blocked.
  } else {
    return true; // cookie is not be blocked.
  }
}

/**
 *
 * @param reqEvents Request event array
 * @returns outbound blocking status
 */
function deriveOutboundBlocking(
  reqEvents: CookieData['networkEvents']['requestEvents']
): CookieData['blockingStatus']['outboundBlock'] {
  const numBlocked: number = reqEvents.reduce((acc, event) => {
    if (event.blocked === null) {
      return acc;
    } else if (event.blocked) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);
  if (numBlocked === 0) {
    return false; // cookie is not blocked.
  } else {
    return true; // cookie is not be blocked.
  }
}

/**
 *
 * @param networkEvents Cookie network events
 * @returns blocking status object
 */
export function deriveBlockingStatus(
  networkEvents: CookieData['networkEvents']
): CookieData['blockingStatus'] {
  return {
    inboundBlock: deriveInboundBlocking(networkEvents.responseEvents),
    outboundBlock: deriveOutboundBlocking(networkEvents.requestEvents),
  };
}
