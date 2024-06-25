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
import { noop } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import filterResources from '../filterResources';

describe('should return only the inline script content', () => {
  it('Should filter the specified items', () => {
    const resources = [
      { type: 'image', url: 'https://test1.com/', getContent: noop },
      { type: 'document', url: 'chrome-extension://', getContent: noop },
      { type: 'script', url: 'debugger://', getContent: noop },
    ];
    const expectedResources = [
      { type: 'script', url: 'https://test1.com/', getContent: noop },
      { type: 'document', url: 'https://test1.com/', getContent: noop },
    ];
    const listToBeFiltered = [...resources, ...expectedResources];

    expect(filterResources(listToBeFiltered)).toEqual(expectedResources);
  });
});
