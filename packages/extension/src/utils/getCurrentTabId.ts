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
export const getCurrentTab = () => {
  try {
    return chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
  } catch (error) {
    //do nothing in this error
  }
  return Promise.resolve(undefined);
};

export const getCurrentTabId = async (tab = null) => {
  const _tab = tab || (await getCurrentTab());

  return _tab?.[0]?.id ? _tab[0].id.toString() : undefined;
};
