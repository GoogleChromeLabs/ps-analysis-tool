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

import Circle from './components/figure/circle';
import Line from './components/figure/line';
import main from './main';

const timeline = new Line(0, 200, 1000, 200, 'black', true);
main.addFigure(timeline, true);

const circles = [
  new Circle(100, 200, 75, 'gray'),
  new Circle(300, 200, 75, 'gray'),
  new Circle(500, 200, 75, 'gray'),
  new Circle(700, 200, 75, 'gray'),
];

circles.forEach((circle) => main.addFigure(circle, true));
