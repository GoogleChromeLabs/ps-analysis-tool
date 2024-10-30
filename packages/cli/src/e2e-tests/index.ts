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
import coffee from 'coffee';

describe('CLI E2E Test', () => {
  const cli = require.resolve('../../dist/main.js');

  it('Should run site analysis', () => {
    return coffee
      .fork(cli, ['-u https://domain-aaa.com/', '-w 1000'])
      .includes('stdout', '/out/domain-aaa-com/report_')
      .end();
  }, 60000);
});
