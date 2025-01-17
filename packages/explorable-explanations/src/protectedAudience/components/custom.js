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
 * Custom component to allow rendering any shape which are used in only some specific cases and are not resuable
 * as the flow relies on a component to be used for each step.
 * @param {object} props Component props
 * @param props.render Render fuction to execute inside the Custom function.
 * @returns {any} Return anything that render function wants to return, mostly nextTip object.
 */
const Custom = ({ render }) => {
  return render();
};

export default Custom;
