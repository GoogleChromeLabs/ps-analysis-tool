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
 * This will make the pending text non-spinnable and make the add a new succeess spinnier.
 * @param spinnies spinnies object to add or update the spinners in the CLI output.
 * @param spinnerName name of the spinner.
 * @param newSpinnerText The text to be added to the new spinner.
 * @param indent The indentation for the new text.
 */
export default function removeAndAddNewSpinnerText(
  spinnies: any,
  spinnerName: string,
  newSpinnerText: string,
  indent = 0
) {
  spinnies.add(`${spinnerName}-succees`, {
    text: newSpinnerText,
    status: 'succeed',
    indent,
  });

  spinnies.update(spinnerName, {
    status: 'non-spinnable',
    indent,
  });
}
