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
import getInlineScriptContent from '../getInlineScriptContent';

describe('should return only the inline script ', () => {
  const htmlString = `<!DOCTYPE html>
    <html>
    <head>
    <title>Inline Script Example</title>
    </head>
    <body>
    
    <h1>This is a heading</h1>
    
    <p>This paragraph will change color when you click the button.</p>
    
    <button onclick="changeColor()">Change Color</button>
    <script>
        let a = [{
            signature: 'google.accounts.id.prompt(', // XXX add check for optional callback parameter
            helpUrl: '',
        },
        {
            signature: 'isDisplayMomment(',
            helpUrl: '',
        },
        {
            signature: 'isDisplayed(',
            helpUrl: '',
        },
        {
            signature: 'isNotDisplayed(',
            helpUrl: '',
        },
        {
            signature: 'getNotDisplayedReason(',
            helpUrl: '',
        },
        {
            signature: 'PromptMomentNotification',
        },
        {
            signature: 'opt_out_or_no_session',
            helpUrl: '',
        }]
    </script>
    
    </body>
    
    </html>`;

  const inLineOnlyString = [
    `
        let a = [{
            signature: 'google.accounts.id.prompt(', // XXX add check for optional callback parameter
            helpUrl: '',
        },
        {
            signature: 'isDisplayMomment(',
            helpUrl: '',
        },
        {
            signature: 'isDisplayed(',
            helpUrl: '',
        },
        {
            signature: 'isNotDisplayed(',
            helpUrl: '',
        },
        {
            signature: 'getNotDisplayedReason(',
            helpUrl: '',
        },
        {
            signature: 'PromptMomentNotification',
        },
        {
            signature: 'opt_out_or_no_session',
            helpUrl: '',
        }]
    `,
  ];

  it('should return matches', () => {
    expect(getInlineScriptContent(htmlString)).toEqual(inLineOnlyString);
  });
});
