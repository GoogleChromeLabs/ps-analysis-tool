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
// @ts-ignore Package does not support typescript.
import Spinnies from 'spinnies';

//Instantiated in the global scpoe
const spinniesWithCheck = new Spinnies({ succeedColor: 'green' });

/**
 *
 * @param text
 */
export default function succeedTextLog(text: string): void {
  spinniesWithCheck.add('0', {
    text,
    status: 'succeed',
    succeedColor: 'green',
  });
}
