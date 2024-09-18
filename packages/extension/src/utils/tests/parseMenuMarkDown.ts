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
 * Internal dependencies.
 */
import parseMenuMarkDown from '../parseMenuMarkDown';

describe('parseMenuMarkdown', () => {
  it('Should parse menu markdown correctly', () => {
    const menuMarkdown = `
        # PSAT Wiki

- [[Home]]
- [Support Forum](https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions/categories/support-forum)
- [Contributor Guide](https://github.com/GoogleChromeLabs/ps-analysis-tool/blob/master/docs/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/GoogleChromeLabs/ps-analysis-tool/blob/master/docs/code-of-conduct.md)
- [[Localization]]

## PSAT DevTools Extension

- [[Evaluation Environment]]
- [[PSAT Settings and Permissions]]
- [[PSAT Extension Popup]]
- [[PSAT Landing Page]]
- [[Cookies]]
  - [[Cookies Landing Page]]
    - [Cookie Exemptions](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Landing-Page#cookie-exemptions)
    - [Known Breakages](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Landing-Page#detecting-potential-breakages)
  - [[Cookies Table]]
    - [Filtering](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#filtering)
    - [Blocked Cookies](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#blocked-cookies)
    - [Frame Overlays](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#frame-overlays)
    - [Allow List](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#allow-cookies-for-specific-domains-during-browsing-sessions)
  - [[General Debugging Actions]]
  - [[Example Analysis Scenarios]]
- [[Site Boundaries]]
  - [[Cookies Having Independent Partitioned State]]
  - [[Related Website Sets]]
- [[Tracking Protection]]
  - [[Bounce Tracking]]
  - [[Fingerprinting]]
  - [[User Agent Strings]]
- [[Private Advertising]]
  - [[Topics]]
  - [[Attribution Reporting]]
  - [[Private Aggregation]]
- [[Facilitated Testing]]
  - [Identifying Facilitated Testing Participation](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Facilitated-Testing#identifying-facilitated-testing-participation)

## PSAT CLI

- [[PSAT Command Line Interface]]
    `;

    const expectedResult = [
      {
        title: 'PSAT Wiki',
        menu: [
          {
            name: 'Home',
            menu: [],
          },
          {
            name: 'Support Forum',
            link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions/categories/support-forum',
            menu: [],
          },
          {
            name: 'Contributor Guide',
            link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/blob/master/docs/CONTRIBUTING.md',
            menu: [],
          },
          {
            name: 'Code of Conduct',
            link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/blob/master/docs/code-of-conduct.md',
            menu: [],
          },
          {
            name: 'Localization',
            menu: [],
          },
        ],
      },
      {
        title: 'PSAT DevTools Extension',
        menu: [
          {
            name: 'Evaluation Environment',
            menu: [],
          },
          {
            name: 'PSAT Settings and Permissions',
            menu: [],
          },
          {
            name: 'PSAT Extension Popup',
            menu: [],
          },
          {
            name: 'PSAT Landing Page',
            menu: [],
          },
          {
            name: 'Cookies',
            menu: [
              {
                name: 'Cookies Landing Page',
                menu: [
                  {
                    name: 'Cookie Exemptions',
                    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Landing-Page#cookie-exemptions',
                    menu: [],
                  },
                  {
                    name: 'Known Breakages',
                    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Landing-Page#detecting-potential-breakages',
                    menu: [],
                  },
                ],
              },
              {
                name: 'Cookies Table',
                menu: [
                  {
                    name: 'Filtering',
                    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#filtering',
                    menu: [],
                  },
                  {
                    name: 'Blocked Cookies',
                    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#blocked-cookies',
                    menu: [],
                  },
                  {
                    name: 'Frame Overlays',
                    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#frame-overlays',
                    menu: [],
                  },
                  {
                    name: 'Allow List',
                    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table#allow-cookies-for-specific-domains-during-browsing-sessions',
                    menu: [],
                  },
                ],
              },
              {
                name: 'General Debugging Actions',
                menu: [],
              },
              {
                name: 'Example Analysis Scenarios',
                menu: [],
              },
            ],
          },
          {
            name: 'Site Boundaries',
            menu: [
              {
                name: 'Cookies Having Independent Partitioned State',
                menu: [],
              },
              {
                name: 'Related Website Sets',
                menu: [],
              },
            ],
          },
          {
            name: 'Tracking Protection',
            menu: [
              {
                name: 'Bounce Tracking',
                menu: [],
              },
              {
                name: 'Fingerprinting',
                menu: [],
              },
              {
                name: 'User Agent Strings',
                menu: [],
              },
            ],
          },
          {
            name: 'Private Advertising',
            menu: [
              {
                name: 'Topics',
                menu: [],
              },
              {
                name: 'Attribution Reporting',
                menu: [],
              },
              {
                name: 'Private Aggregation',
                menu: [],
              },
            ],
          },
          {
            name: 'Facilitated Testing',
            menu: [
              {
                name: 'Identifying Facilitated Testing Participation',
                link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Facilitated-Testing#identifying-facilitated-testing-participation',
                menu: [],
              },
            ],
          },
        ],
      },
      {
        title: 'PSAT CLI',
        menu: [
          {
            name: 'PSAT Command Line Interface',
            menu: [],
          },
        ],
      },
    ];

    const parsedData = parseMenuMarkDown(menuMarkdown);

    expect(parsedData).toEqual(expectedResult);
  });
});
