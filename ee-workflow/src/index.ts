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
import Image from './components/figure/image';
import Line from './components/figure/line';
import Text from './components/figure/text';
import Group from './components/group';
import main from './main';

const timeline = new Line(0, 200, 1000, 200, 'black');

const circles = [
  new Circle(100, 200, 75, '#EDF2EF'),
  new Circle(300, 200, 75, '#EDF2EF'),
  new Circle(500, 200, 75, '#EDF2EF'),
  new Circle(700, 200, 75, '#EDF2EF'),
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

const userIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg==';
const completedIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNTk4NUUxIj48cGF0aCBkPSJNNDgwLTgwcS04NSAwLTE1OC0zMC41VDE5NS0xOTVxLTU0LTU0LTg0LjUtMTI3VDgwLTQ4MHEwLTg0IDMwLjUtMTU3VDE5NS03NjRxNTQtNTQgMTI3LTg1dDE1OC0zMXE3NSAwIDE0MCAyNHQxMTcgNjZsLTQzIDQzcS00NC0zNS05OC01NHQtMTE2LTE5cS0xNDUgMC0yNDIuNSA5Ny41VDE0MC00ODBxMCAxNDUgOTcuNSAyNDIuNVQ0ODAtMTQwcTE0NSAwIDI0Mi41LTk3LjVUODIwLTQ4MHEwLTMwLTQuNS01OC41VDgwMi01OTRsNDYtNDZxMTYgMzcgMjQgNzd0OCA4M3EwIDg1LTMxIDE1OHQtODUgMTI3cS01NCA1NC0xMjcgODQuNVQ0ODAtODBabS01OS0yMThMMjU2LTQ2NGw0NS00NSAxMjAgMTIwIDQxNC00MTQgNDYgNDUtNDYwIDQ2MFoiLz48L3N2Zz4=';

const advertiserFlow = [
  new Image(100, 200, userIcon, 50, 50),
  new Line(95, 237, 95, 300, 'black', true),
  new Group([
    new Box(50, 300, 100, 50, '#EDF2EF'),
    new Text(100, 325, 'DSP tags'),
  ]),
  new Line(95, 350, 95, 413, 'black', true),
  new Group([new Box(50, 413, 100, 50, '#EDF2EF'), new Text(100, 438, 'DSPs')]),
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

main.addGroup(
  new Group([
    new Line(0, 200, 63, 200, 'blue'),
    new Circle(100, 200, 75, '#EDF2EF', 'blue'),
    new Image(100, 200, completedIcon, 50, 50),
  ])
);

const secondCircleAnimations = [
  new Image(300, 200, userIcon, 50, 50),
  new Line(295, 237, 295, 300, 'black', true),
  new Group([
    new Box(250, 300, 100, 50, '#EDF2EF'),
    new Text(300, 325, 'DSP tags'),
  ]),
  new Line(295, 350, 295, 413, 'black', true),
  new Group([
    new Box(250, 413, 100, 50, '#EDF2EF'),
    new Text(300, 438, 'DSPs'),
  ]),
  new Line(305, 413, 305, 350, 'black', true),
  new Line(305, 300, 305, 237, 'black', true),
  new Text(370, 270, 'joinInterestGroup()', 12),
];

main.addAnimator(new Animator(secondCircleAnimations));

main.addGroup(
  new Group([
    new Line(137, 200, 263, 200, 'blue'),
    new Circle(300, 200, 75, '#EDF2EF', 'blue'),
    new Image(300, 200, completedIcon, 50, 50),
  ])
);

const thirdCircleAnimations = [
  new Image(500, 200, userIcon, 50, 50),
  new Line(495, 237, 495, 300, 'black', true),
  new Group([
    new Box(450, 300, 100, 50, '#EDF2EF'),
    new Text(500, 325, 'DSP tags'),
  ]),
  new Line(495, 350, 495, 413, 'black', true),
  new Group([
    new Box(450, 413, 100, 50, '#EDF2EF'),
    new Text(500, 438, 'DSPs'),
  ]),
  new Line(505, 413, 505, 350, 'black', true),
  new Line(505, 300, 505, 237, 'black', true),
  new Text(570, 270, 'joinInterestGroup()', 12),
];

main.addAnimator(new Animator(thirdCircleAnimations));

main.addGroup(
  new Group([
    new Line(337, 200, 463, 200, 'blue'),
    new Circle(500, 200, 75, '#EDF2EF', 'blue'),
    new Image(500, 200, completedIcon, 50, 50),
  ])
);

const fourthCircleAnimations = [
  new Image(700, 200, userIcon, 50, 50),
  new Line(695, 237, 695, 300, 'black', true),
  new Group([
    new Box(650, 300, 100, 50, '#EDF2EF'),
    new Text(700, 325, 'DSP tags'),
  ]),
  new Line(695, 350, 695, 413, 'black', true),
  new Group([
    new Box(650, 413, 100, 50, '#EDF2EF'),
    new Text(700, 438, 'DSPs'),
  ]),
  new Line(705, 413, 705, 350, 'black', true),
  new Line(705, 300, 705, 237, 'black', true),
  new Text(770, 270, 'joinInterestGroup()', 12),
];

main.addAnimator(new Animator(fourthCircleAnimations));

main.addGroup(
  new Group([
    new Line(537, 200, 663, 200, 'blue'),
    new Circle(700, 200, 75, '#EDF2EF', 'blue'),
    new Image(700, 200, completedIcon, 50, 50),
  ])
);
