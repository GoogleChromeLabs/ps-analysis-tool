/*
 * Copyright 2024 Google LLC
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
import { useContextSelector } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import Context, { type WebStoryContext } from './context';

export function useWebStories(): WebStoryContext;
export function useWebStories<T>(selector: (state: WebStoryContext) => T): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useWebStories<T>(
  selector: (state: WebStoryContext) => T | WebStoryContext = (state) => state
) {
  return useContextSelector(Context, selector);
}

export default useWebStories;
