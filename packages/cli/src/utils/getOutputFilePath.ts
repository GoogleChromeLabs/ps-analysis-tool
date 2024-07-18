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
import { getCurrentDateAndTime } from '.';

/**
 * Get output file path.
 * @param {string} outDir Out directory
 * @returns {string} file path
 */
const getOutputFilePath = (outDir: string): string => {
  const currentDateAndTime = getCurrentDateAndTime('YYYY-MM-DD_HH-MM');
  const fileName = outDir + `/report_` + currentDateAndTime + '.html';

  return fileName;
};

export default getOutputFilePath;
