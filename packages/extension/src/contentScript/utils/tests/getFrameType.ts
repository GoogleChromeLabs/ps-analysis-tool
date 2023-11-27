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
import getFrameType from '../getFrameType';

describe('getFrameType', () => {
  it('should return frame type (Hidden iframe)', () => {
    const iframe = document.createElement('iframe');

    expect(getFrameType(true, null, 'BODY')).toEqual('Hidden iframe');
    expect(getFrameType(true, null, 'DIV')).toEqual('Hidden iframe');
    expect(getFrameType(true, iframe, 'BODY')).toEqual('Hidden iframe');
    expect(getFrameType(true, iframe, 'DIV')).toEqual('Hidden iframe');
  });

  it('should return frame type (Nested iframe)', () => {
    const iframe = document.createElement('iframe');

    expect(getFrameType(false, iframe, 'BODY')).toEqual('Nested iframe');
    expect(getFrameType(false, iframe, 'DIV')).toEqual('Nested iframe');
  });

  it('should return frame type (Main frame)', () => {
    expect(getFrameType(false, null, 'BODY')).toEqual('Main frame');
  });

  it('should return frame type (iframe)', () => {
    expect(getFrameType(false, null, 'DIV')).toEqual('iframe');
    expect(getFrameType(false, null, 'SPAN')).toEqual('iframe');
  });
});
