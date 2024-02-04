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
import {
  RESPONSE_EVENT,
  REQUEST_EVENT,
  type responsEvent,
  type requestEvent,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { deriveBlockingStatus } from '../deriveBlockingStatus';

const mockRespArray: responsEvent[] = [
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
      inboundBlock: false,
      outboundBlock: false,
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
      inboundBlock: null,
      outboundBlock: false,
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
      inboundBlock: true,
      outboundBlock: false,
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
      inboundBlock: false,
      outboundBlock: true,
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
      inboundBlock: false,
      outboundBlock: true,
    });
    mockReqArray.forEach((ev) => {
      ev.blocked = false;
    });
  });

  it('should ignore non CDP events in request', () => {
    mockReqArray[1].type =
      REQUEST_EVENT.CHROME_WEBREQUEST_ON_BEFORE_SEND_HEADERS;
    mockReqArray[1].blocked = null;
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: false,
      outboundBlock: false,
    });
    mockReqArray[1].type = REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO;
    mockReqArray[1].blocked = false;
  });

  it('should ignore non CDP events in response', () => {
    mockRespArray[1].type =
      RESPONSE_EVENT.CHROME_WEBREQUEST_ON_RESPONSE_STARTED;
    mockRespArray[1].blocked = null;
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: false,
      outboundBlock: false,
    });
    mockRespArray[1].type = RESPONSE_EVENT.CDP_RESPONSE_RECEIVED_EXTRA_INFO;
    mockRespArray[1].blocked = false;
  });

  it('should ignore non CDP events in request 2', () => {
    mockReqArray[0].blocked = true;
    mockReqArray[1].type =
      REQUEST_EVENT.CHROME_WEBREQUEST_ON_BEFORE_SEND_HEADERS;
    mockReqArray[1].blocked = null;
    mockReqArray[2].blocked = true;
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: false,
      outboundBlock: true,
    });
    mockReqArray[0].blocked = false;
    mockReqArray[1].type = REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO;
    mockReqArray[1].blocked = false;
    mockReqArray[2].blocked = false;
  });

  it('should ignore non CDP events in response 2', () => {
    mockRespArray[0].blocked = true;
    mockRespArray[1].type =
      RESPONSE_EVENT.CHROME_WEBREQUEST_ON_RESPONSE_STARTED;
    mockRespArray[1].blocked = null;
    mockRespArray[2].blocked = true;
    expect(
      deriveBlockingStatus({
        requestEvents: mockReqArray,
        responseEvents: mockRespArray,
      })
    ).toStrictEqual({
      inboundBlock: true,
      outboundBlock: false,
    });
    mockRespArray[0].blocked = true;
    mockRespArray[1].type = RESPONSE_EVENT.CDP_RESPONSE_RECEIVED_EXTRA_INFO;
    mockRespArray[1].blocked = false;
    mockRespArray[2].blocked = true;
  });
});
