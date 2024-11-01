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
import app from '../app';

const Box = ({ title, x, y, width, height }) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);
  app.p.rect(x, y, width, height);
  app.p.push();
  app.p.strokeWeight(0.1);
  app.p.textFont('ui-sans-serif');
  app.p.text(title, x + width / 2, y + height / 2);
  app.p.pop();
};

export default Box;
