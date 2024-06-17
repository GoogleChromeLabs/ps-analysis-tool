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
 * Internal dependencies.
 */
import {
  BLOCK_STATUS,
  CookieData,
  responsEvent,
  requestEvent,
} from '../cookies.types';

/**
 * Derives if a cookie was blocked in response header.
 * @param respEvents Response event array
 * @returns Outbound Blocking status.
 * 'false' - The cookie was never blocked.
 * 'null' - The cookie wa blocked in atleast one or all of the response headers
 * 'true' - The cookie was blocked in all of the response headers.
 */
function deriveInboundBlocking(respEvents: responsEvent[]): BLOCK_STATUS {
  // if there are not response events the cookie must be stored in a previous visit
  // Or there is a javascript not used in the request header.
  if (respEvents.length === 0) {
    return BLOCK_STATUS.NOT_BLOCKED;
  }

  // Number of responses in which the cookie was blocked.
  const numBlocked: number = respEvents.reduce((acc, event) => {
    if (event.blocked) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  if (numBlocked === 0) {
    return BLOCK_STATUS.NOT_BLOCKED;
  } else if (0 < numBlocked && numBlocked < respEvents.length) {
    return BLOCK_STATUS.BLOCKED_IN_SOME_EVENTS;
  } else {
    return BLOCK_STATUS.BLOCKED_IN_ALL_EVENTS;
  }
}

/**
 * Derives if a cookie was blocked in request header.
 * @param reqEvents Request event array
 * @returns Outbound Blocking status.
 * 'false' implies that the cookie was never blocked.
 * 'true' means that is was blocked in atleast one of the requests.
 */
function deriveOutboundBlocking(reqEvents: requestEvent[]): BLOCK_STATUS {
  const numBlocked: number = reqEvents.reduce((acc, event) => {
    if (event.blocked) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  if (numBlocked === 0) {
    return BLOCK_STATUS.NOT_BLOCKED;
  } else if (0 < numBlocked && numBlocked < reqEvents.length) {
    return BLOCK_STATUS.BLOCKED_IN_SOME_EVENTS;
  } else {
    return BLOCK_STATUS.BLOCKED_IN_ALL_EVENTS;
  }
}

/**
 * @param networkEvents Cookie network events
 * @returns blocking status object
 */
export default function deriveBlockingStatus(
  networkEvents: CookieData['networkEvents']
): CookieData['blockingStatus'] {
  if (!networkEvents) {
    return {
      inboundBlock: BLOCK_STATUS.UNKNOWN,
      outboundBlock: BLOCK_STATUS.UNKNOWN,
    };
  }
  return {
    inboundBlock: deriveInboundBlocking(networkEvents.responseEvents),
    outboundBlock: deriveOutboundBlocking(networkEvents.requestEvents),
  };
}
