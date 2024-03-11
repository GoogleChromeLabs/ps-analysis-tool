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
import { addUTMParams } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import getHelpUrl from '../getHelpUrl';

describe('Test for helpUrls function', () => {
  it('Should filter the specified items', () => {
    const signatureConfigItemArray = [
      {
        signature: 'google.accounts.id.prompt(', // XXX add check for optional callback parameter
        helpUrl: 'https://example1.com',
      },
      {
        signature: 'isDisplayMomment(',
        helpUrl: 'https://example2.com',
      },
    ];

    expect(
      getHelpUrl(
        signatureConfigItemArray[1].signature,
        signatureConfigItemArray
      )
    ).toEqual(addUTMParams(signatureConfigItemArray[1].helpUrl));
  });

  it('Should filter the fallback string as defined in the function', () => {
    const fallbackString = '';

    const signatureConfigItemArray = [
      {
        signature: 'google.accounts.id.prompt(', // XXX add check for optional callback parameter
        helpUrl: 'helpfulLink1',
      },
      {
        signature: 'isDisplayMomment(',
        helpUrl: 'helpfulLink2',
      },
    ];

    expect(getHelpUrl('not present string', signatureConfigItemArray)).toEqual(
      fallbackString
    );
  });
});
