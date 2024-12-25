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
import Animator from './components/animator';
import Box from './components/figure/box';
import Circle from './components/figure/circle';
import Line from './components/figure/line';
import Text from './components/figure/text';
import Group from './components/group';
import main from './main';

const timeline = new Line(0, 200, 1000, 200, 'black');

const circles = [
  new Circle(100, 200, 75, 'gray'),
  new Circle(300, 200, 75, 'gray'),
  new Circle(500, 200, 75, 'gray'),
  new Circle(700, 200, 75, 'gray'),
];

const textonCircles = [
  new Text(100, 75, '2024-01-01'),
  new Text(100, 100, 'adv1.com'),
  new Text(300, 75, '2024-01-02'),
  new Text(300, 100, 'adv2.com'),
  new Text(500, 75, '2024-01-03'),
  new Text(500, 100, 'adv3.com'),
  new Text(700, 75, '2024-01-04'),
  new Text(700, 100, 'adv4.com'),
];

const circleToTextLine = [
  new Line(100, 163, 100, 110, 'black'),
  new Line(300, 163, 300, 110, 'black'),
  new Line(500, 163, 500, 110, 'black'),
  new Line(700, 163, 700, 110, 'black'),
];

const advertiserFlow = [
  new Line(95, 237, 95, 300, 'black', true),
  new Group([
    new Box(50, 300, 100, 50, 'gray'),
    new Text(100, 325, 'DSP tags'),
  ]),
  new Line(95, 350, 95, 413, 'black', true),
  new Group([new Box(50, 413, 100, 50, 'gray'), new Text(100, 438, 'DSPs')]),
  new Line(105, 413, 105, 350, 'black', true),
  new Line(105, 300, 105, 237, 'black', true),
  new Text(170, 270, 'joinInterestGroup()', 12),
];

// Setup timeline.
main.addFigure(timeline, true);
circles.forEach((circle) => main.addFigure(circle, true));
textonCircles.forEach((text) => main.addFigure(text, true));
circleToTextLine.forEach((line) => main.addFigure(line, true));

// Setup flow.
main.addAnimator(new Animator(advertiserFlow));
main.addFigure(new Line(0, 0, 0, 0));
