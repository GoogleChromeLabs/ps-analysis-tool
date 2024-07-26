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
  RESPONSE_EVENT,
  REQUEST_EVENT,
  responseEvent,
  requestEvent,
} from '../../cookies.types';
import deriveBlockingStatus from '../deriveBlockingStatus';

const mockRespArray: responseEvent[] = [
  {
    type: RESPONSE_EVENT.CDP_RESPONSE_RECEIVED_EXTRA_INFO,
    blocked: false,
    timeStamp: 1,
    requestId: '1',
    url: '',
  },
  {
    type: RESPONSE_EVENT.CDP_RESPONSE_RECEIVED_EXTRA_INFO,
    blocked: false,
    timeStamp: 2,
    requestId: '2',
    url: '',
  },
  {
    type: RESPONSE_EVENT.CDP_RESPONSE_RECEIVED_EXTRA_INFO,
    blocked: false,
    timeStamp: 3,
    requestId: '3',
    url: '',
  },
];

const mockReqArray: requestEvent[] = [
  {
    type: REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO,
    blocked: false,
    timeStamp: 1,
    requestId: '1',
    url: '',
  },
  {
    type: REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO,
    blocked: false,
    timeStamp: 2,
    requestId: '2',
    url: '',
  },
  {
    type: REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO,
    blocked: false,
    timeStamp: 3,
    requestId: '3',
    url: '',
  },
];

describe('deriveBlockingStatus', () => {
  it('Not blocked in any events', () => {
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: BLOCK_STATUS.NOT_BLOCKED,
      outboundBlock: BLOCK_STATUS.NOT_BLOCKED,
    });
  });

  it('Blocked in one response', () => {
    mockRespArray[0].blocked = true;
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: BLOCK_STATUS.BLOCKED_IN_SOME_EVENTS,
      outboundBlock: BLOCK_STATUS.NOT_BLOCKED,
    });
  });

  it('Blocked in all response', () => {
    mockRespArray.forEach((ev) => {
      ev.blocked = true;
    });
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: BLOCK_STATUS.BLOCKED_IN_ALL_EVENTS,
      outboundBlock: BLOCK_STATUS.NOT_BLOCKED,
    });
    mockRespArray.forEach((ev) => {
      ev.blocked = false;
    });
  });

  it('Blocked in one request', () => {
    mockReqArray[0].blocked = true;
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: BLOCK_STATUS.NOT_BLOCKED,
      outboundBlock: BLOCK_STATUS.BLOCKED_IN_SOME_EVENTS,
    });
    mockReqArray[0].blocked = false;
  });

  it('Blocked in all requests', () => {
    mockReqArray.forEach((ev) => {
      ev.blocked = true;
    });
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: BLOCK_STATUS.NOT_BLOCKED,
      outboundBlock: BLOCK_STATUS.BLOCKED_IN_ALL_EVENTS,
    });
    mockReqArray.forEach((ev) => {
      ev.blocked = false;
    });
  });
});
