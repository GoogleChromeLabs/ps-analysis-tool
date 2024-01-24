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
import type { LibraryData } from '../../types';
import sumUpDetectionResults from '../sumUpDetectionResults';

describe('sumUpDetectionResults', () => {
  it('On Added these Objects should return the same result object', () => {
    const obj1: LibraryData = {
      gis: {
        signatureMatches: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeature',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 1,
        moduleMatch: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeatureGSI',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrlGSI2',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gsiSourceOld',
                  snippet: 'gsiSnippetOld',
                },
              ],
            },
          },
        ],
      },
    };

    const obj2: LibraryData = {
      gis: {
        signatureMatches: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeature',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature2',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature3',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 1,
        moduleMatch: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeatureGSI',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrlGSI2',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gsi2Source_tobeadded',
                  snippet: 'gsi2Snippet__tobeadded',
                },
              ],
            },
          },
        ],
      },
    };
    const resultToBe: LibraryData = {
      gis: {
        signatureMatches: 2,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeature',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature2',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature3',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 2,
        moduleMatch: 2,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeatureGSI',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrlGSI2',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gsiSourceOld',
                  snippet: 'gsiSnippetOld',
                },
                {
                  sourceLocation: 'gsi2Source_tobeadded',
                  snippet: 'gsi2Snippet__tobeadded',
                },
              ],
            },
          },
        ],
      },
    };
    // Call the function with the iframe element and expect the returned object to match the set attributes
    expect(sumUpDetectionResults(obj1, obj2)).toEqual(resultToBe);
  });
  it('On Added these Objects should return the same result object', () => {
    const obj1: LibraryData = {
      gis: {
        signatureMatches: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeature',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 1,
        moduleMatch: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeatureGSI',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrlGSI2',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gsiSourceOld',
                  snippet: 'gsiSnippetOld',
                },
              ],
            },
          },
        ],
      },
    };

    const obj2: LibraryData = {
      gis: {
        signatureMatches: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeature',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature2',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature3_obj2',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 1,
        moduleMatch: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeatureGSI',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrlGSI2',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gsi2Source_tobeadded',
                  snippet: 'gsi2Snippet__tobeadded',
                },
              ],
            },
          },
        ],
      },
    };
    const resultToBe: LibraryData = {
      gis: {
        signatureMatches: 2,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeature',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature2',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'testFeature3_obj2',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
                {
                  sourceLocation: 'gisSource_tobeadded',
                  snippet: 'gisSnippet_tobeadded',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 2,
        moduleMatch: 2,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeatureGSI',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrlGSI2',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gsiSourceOld',
                  snippet: 'gsiSnippetOld',
                },
                {
                  sourceLocation: 'gsi2Source_tobeadded',
                  snippet: 'gsi2Snippet__tobeadded',
                },
              ],
            },
          },
        ],
      },
    };
    // Call the function with the iframe element and expect the returned object to match the set attributes
    expect(sumUpDetectionResults(obj1, obj2)).toEqual(resultToBe);
  });

  it('should return the obj1 result when summing with empty objects', () => {
    const obj1: LibraryData = {
      gis: {
        signatureMatches: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeature',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrl',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gisSourceOld',
                  snippet: 'gisSnippetOld',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 1,
        moduleMatch: 1,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'testFeatureGSI',
              /* Link to the migration guide for all features instead of linking to individual
               * pages as the instructions to update the codebase are short and simple.
               */
              url: 'testUrlGSI2',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation: 'gsiSourceOld',
                  snippet: 'gsiSnippetOld',
                },
              ],
            },
          },
        ],
      },
    };

    const obj2: LibraryData = {
      gis: {
        signatureMatches: 0,
        matches: [],
      },
      gsiV2: {
        signatureMatches: 0,
        moduleMatch: 0,
        matches: [],
      },
    };

    // Call the function with the iframe element and expect the returned object to match the set attributes
    expect(sumUpDetectionResults(obj1, obj2)).toEqual(obj1);
  });

  it('Should return same result test #3', () => {
    const obj1: LibraryData = {
      gis: {
        signatureMatches: 6,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'opt_out_or_no_session',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    '",MISSING_CLIENT_ID:"missing_client_id",OPT_OUT_OR_NO_SESSION:"opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '",MISSING_CLIENT_ID:"missing_client_id",OPT_OUT_OR_NO_SESSION:"opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '",MISSING_CLIENT_ID:"missing_client_id",OPT_OUT_OR_NO_SESSION:"opt_out_or_no_session',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'google.accounts.id.prompt(',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    'atchEvent(n)}},{key:"promptOneTap",value:function(){var e=this;google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    'var e=this;return this.isLibraryLoaded.then((function(){window.google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'atchEvent(n)}},{key:"promptOneTap",value:function(){var e=this;google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'var e=this;return this.isLibraryLoaded.then((function(){window.google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'ustomEvent($g,{detail:t});this.dispatchEvent(n)}promptOneTap(){google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '})}promptOneTap(){return this.isLibraryLoaded.then(()=>{window.google.accounts.id.prompt(',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'getNotDisplayedReason(',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'e=>{const t={type:e.getMomentType(),reason:e.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'e=>{const t={type:e.getMomentType(),reason:e.getNotDisplayedReason(',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 12,
        moduleMatch: 0,
        matches: [],
      },
    };

    const obj2: LibraryData = {
      gis: {
        signatureMatches: 3,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'isNotDisplayed(',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    't()&&!this.h};_.k.getNotDisplayedReason=function(){return this.isNotDisplayed(',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'opt_out_or_no_session',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    '.E(e,2)?(_.de(_.H(e,_.Je,2)),e=_.E(_.H(e,_.Je,2),1),d.j(2===e?"opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    ')):e&&!_.P(e,3)?(_.w("No sessions found in the browser."),d.j("opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    ',2)){e=_.H(e,_.Je,2);_.de(e);switch(_.E(e,1)){case 1:case 2:e="opt_out_or_no_session',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'PromptMomentNotification',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    'n);_.C("google.accounts.id.prompt",ln);_.C("google.accounts.id.PromptMomentNotification',
                },
              ],
            },
          },
        ],
      },
      gsiV2: { signatureMatches: 0, moduleMatch: 0, matches: [] },
    };

    const resultToBe: LibraryData = {
      gis: {
        signatureMatches: 9,
        matches: [
          {
            feature: {
              type: 'link',
              text: 'opt_out_or_no_session',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    '",MISSING_CLIENT_ID:"missing_client_id",OPT_OUT_OR_NO_SESSION:"opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '",MISSING_CLIENT_ID:"missing_client_id",OPT_OUT_OR_NO_SESSION:"opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '",MISSING_CLIENT_ID:"missing_client_id",OPT_OUT_OR_NO_SESSION:"opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    '.E(e,2)?(_.de(_.H(e,_.Je,2)),e=_.E(_.H(e,_.Je,2),1),d.j(2===e?"opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    ')):e&&!_.P(e,3)?(_.w("No sessions found in the browser."),d.j("opt_out_or_no_session',
                },
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    ',2)){e=_.H(e,_.Je,2);_.de(e);switch(_.E(e,1)){case 1:case 2:e="opt_out_or_no_session',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'google.accounts.id.prompt(',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    'atchEvent(n)}},{key:"promptOneTap",value:function(){var e=this;google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    'var e=this;return this.isLibraryLoaded.then((function(){window.google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'atchEvent(n)}},{key:"promptOneTap",value:function(){var e=this;google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'var e=this;return this.isLibraryLoaded.then((function(){window.google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'ustomEvent($g,{detail:t});this.dispatchEvent(n)}promptOneTap(){google.accounts.id.prompt(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '})}promptOneTap(){return this.isLibraryLoaded.then(()=>{window.google.accounts.id.prompt(',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'getNotDisplayedReason(',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/8chnn80psbf0smt8ayx1fvzpf',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    '(function(t){var n={type:t.getMomentType(),reason:t.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'e=>{const t={type:e.getMomentType(),reason:e.getNotDisplayedReason(',
                },
                {
                  sourceLocation:
                    'https://static.licdn.com/aero-v1/sc/h/zneroqcg3fuolytnnlpn2s27',
                  snippet:
                    'e=>{const t={type:e.getMomentType(),reason:e.getNotDisplayedReason(',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'isNotDisplayed(',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    't()&&!this.h};_.k.getNotDisplayedReason=function(){return this.isNotDisplayed(',
                },
              ],
            },
          },
          {
            feature: {
              type: 'link',
              text: 'PromptMomentNotification',
              url: 'https://developers.google.com/identity/gsi/web/guides/migration',
            },
            subItems: {
              type: 'subitems',
              items: [
                {
                  sourceLocation:
                    'https://www.linkedin.com/_/gsi/_/js/k=gsi.gsi.en.DgQBvtwGONo.O/am=chE/d=1/rs=AF0KOtW0-gB89A6n64tspOqFHLLZ14K4gw/m=gis_client_library',
                  snippet:
                    'n);_.C("google.accounts.id.prompt",ln);_.C("google.accounts.id.PromptMomentNotification',
                },
              ],
            },
          },
        ],
      },
      gsiV2: {
        signatureMatches: 12,
        moduleMatch: 0,
        matches: [],
      },
    };

    // Call the function with the iframe element and expect the returned object to match the set attributes
    expect(sumUpDetectionResults(obj1, obj2)).toEqual(resultToBe);
  });
});
