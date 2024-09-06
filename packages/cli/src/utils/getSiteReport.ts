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
 * External dependencies
 */
import {
  parseUrl,
  type CompleteJson,
  type ErroredOutUrlsData,
  type SingleURLError,
} from '@google-psat/common';
import {
  type DetectionFunctions,
  detectMatchingSignatures,
  LIBRARIES,
  type LibraryData,
} from '@google-psat/library-detection';

/**
 * This function returns the exact object which will be sent to the cli dashboard when report is generated.
 * @param urls The user provided urls to be processed.
 * @param processedData The cookie data along with library detection information with erroredOutUrls.
 * @param technologyAnalysisData The technology analysis data from CLI.
 * @returns {object} The object which will be used to send the report to the cli dashboard.
 */
function getSiteReport(
  urls: string[],
  processedData: any,
  technologyAnalysisData: any
) {
  return urls.map((url, index) => {
    const hasTimeOutError = (
      processedData[index].erroredOutUrls[url] as SingleURLError[]
    )?.some(
      ({ errorName }) => errorName === 'TimeoutError' || errorName === 'i'
    );

    const detectedMatchingSignatures: LibraryData = {
      ...detectMatchingSignatures(
        processedData[index].resources ?? [],
        Object.fromEntries(
          LIBRARIES.map((library) => [library.name, library.detectionFunction])
        ) as DetectionFunctions
      ),
      ...(processedData[index]?.domQueryMatches ?? {}),
    };

    if (
      processedData[index].erroredOutUrls[url] &&
      processedData[index].erroredOutUrls[url].length > 0
    ) {
      if (hasTimeOutError) {
        return {
          pageUrl: parseUrl(url) ? new URL(url).href : encodeURI(url),
          technologyData: technologyAnalysisData
            ? technologyAnalysisData[index]
            : [],
          cookieData: processedData[index].cookieData,
          libraryMatches: detectedMatchingSignatures ?? [],
          erroredOutUrls: [
            ...processedData[index].erroredOutUrls[url].map(
              (errors: SingleURLError) => {
                return {
                  url: parseUrl(url) ? new URL(url).href : encodeURI(url),
                  ...errors,
                };
              }
            ),
          ] as ErroredOutUrlsData[],
        } as unknown as CompleteJson;
      }

      return {
        pageUrl: parseUrl(url) ? new URL(url).href : encodeURI(url),
        technologyData: [],
        cookieData: {},
        libraryMatches: [],
        erroredOutUrls: [
          ...processedData[index].erroredOutUrls[url].map(
            (errors: SingleURLError) => {
              return {
                url,
                ...errors,
              };
            }
          ),
        ] as ErroredOutUrlsData[],
      } as unknown as CompleteJson;
    }

    return {
      pageUrl: encodeURI(url),
      technologyData: technologyAnalysisData
        ? technologyAnalysisData[index]
        : [],
      cookieData: processedData[index].cookieData,
      libraryMatches: detectedMatchingSignatures ?? [],
    } as unknown as CompleteJson;
  });
}

export default getSiteReport;
