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
import promptly from 'promptly';

/**
 * Ask user input.
 * @param {string} message Message to user.
 * @param {object} options Options.
 * @returns {Promise<any>} User's input.
 */
async function askUserInput(
  message: string,
  options: object = {}
): Promise<string> {
  const userInput: string = await promptly.prompt(message, options);
  return userInput;
}

export default askUserInput;
