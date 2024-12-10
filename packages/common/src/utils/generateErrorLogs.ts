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
 * Internal dependencies
 */
import { CompleteJson } from '../cookies.types';

/**
 * This function generates error logs file for a sitemap analysis.
 * @param JSONReport The JSON report for which error logs file has to be generated
 * @returns string of error logs.
 */
export const generateErrorLogFile = (JSONReport: CompleteJson[]) => {
  let erroredOutTextFileData = '';

  JSONReport.forEach(({ erroredOutUrls }) => {
    if (!erroredOutUrls) {
      return;
    }

    erroredOutUrls.forEach((error) => {
      const temporaryFormedData = `
        URL: ${error.url}
        Error Code: ${error.errorCode ?? 'N/A'}
        Error Message: ${error.errorMessage}
        ErrorStack: 
        ${error.stackTrace ?? 'N/A'}
        `;

      erroredOutTextFileData += temporaryFormedData + '\n';
    });
  });

  return erroredOutTextFileData;
};

export default generateErrorLogFile;
