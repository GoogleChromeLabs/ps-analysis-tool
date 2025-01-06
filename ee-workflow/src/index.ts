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
import { Animator, FigureFactory, Group } from './components';
import Main from './main';

const mainCanvas = new Main();
const mainFF = new FigureFactory(mainCanvas);

const IGCanvas = new Main(false);
IGCanvas.setDelay(1);
const IGFF = new FigureFactory(IGCanvas);
IGCanvas.togglePause();

const timeline = mainFF.line(0, 200, 1000, 200, 'black');

const circles = [
  mainFF.circle(100, 200, 75, '#EDF2EF'),
  mainFF.circle(300, 200, 75, '#EDF2EF'),
  mainFF.circle(500, 200, 75, '#EDF2EF'),
  mainFF.circle(700, 200, 75, '#EDF2EF'),
];

const textonCircles = [
  mainFF.text(100, 75, '2024-01-01'),
  mainFF.text(100, 100, 'adv1.com'),
  mainFF.text(300, 75, '2024-01-02'),
  mainFF.text(300, 100, 'adv2.com'),
  mainFF.text(500, 75, '2024-01-03'),
  mainFF.text(500, 100, 'adv3.com'),
  mainFF.text(700, 75, '2024-01-04'),
  mainFF.text(700, 100, 'adv4.com'),
];

const circleToTextLine = [
  mainFF.line(100, 163, 100, 110, 'black'),
  mainFF.line(300, 163, 300, 110, 'black'),
  mainFF.line(500, 163, 500, 110, 'black'),
  mainFF.line(700, 163, 700, 110, 'black'),
];

const userIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg==';

const completedIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNTk4NUUxIj48cGF0aCBkPSJNNDgwLTgwcS04NSAwLTE1OC0zMC41VDE5NS0xOTVxLTU0LTU0LTg0LjUtMTI3VDgwLTQ4MHEwLTg0IDMwLjUtMTU3VDE5NS03NjRxNTQtNTQgMTI3LTg1dDE1OC0zMXE3NSAwIDE0MCAyNHQxMTcgNjZsLTQzIDQzcS00NC0zNS05OC01NHQtMTE2LTE5cS0xNDUgMC0yNDIuNSA5Ny41VDE0MC00ODBxMCAxNDUgOTcuNSAyNDIuNVQ0ODAtMTQwcTE0NSAwIDI0Mi41LTk3LjVUODIwLTQ4MHEwLTMwLTQuNS01OC41VDgwMi01OTRsNDYtNDZxMTYgMzcgMjQgNzd0OCA4M3EwIDg1LTMxIDE1OHQtODUgMTI3cS01NCA1NC0xMjcgODQuNVQ0ODAtODBabS01OS0yMThMMjU2LTQ2NGw0NS00NSAxMjAgMTIwIDQxNC00MTQgNDYgNDUtNDYwIDQ2MFoiLz48L3N2Zz4=';

const advertiserFlow = [
  mainFF.image(100, 200, userIcon, 50, 50),
  mainFF.line(95, 237, 95, 300, 'black', true, true),
  new Group([
    mainFF.box(50, 300, 100, 50, '#EDF2EF'),
    mainFF.text(100, 325, 'DSP tags'),
  ]),
  mainFF.line(95, 350, 95, 413, 'black', true, true),
  new Group([
    mainFF.box(50, 413, 100, 50, '#EDF2EF'),
    mainFF.text(100, 438, 'DSPs'),
  ]),
  mainFF.line(105, 413, 105, 350, 'black', true, true),
  mainFF.line(105, 300, 105, 237, 'black', true, true),
  mainFF.text(170, 270, 'joinInterestGroup()', 12),
];

// Setup timeline.
mainCanvas.addFigure(timeline, true);
circles.forEach((circle) => mainCanvas.addFigure(circle, true));
textonCircles.forEach((text) => mainCanvas.addFigure(text, true));
circleToTextLine.forEach((line) => mainCanvas.addFigure(line, true));

// add IG bubble canvas here
// pause the main canvas operations
// add elements to IG canvas
const bubbles = [];
let startX = 170;
let startY = 270;
while (startX > 0 && startY > 0) {
  const circle = IGFF.circle(startX, startY, 10, 'orange', 'black');
  bubbles.push(circle);
  startX -= 1;
  startY -= 1;
}

const bubbleFlow = new Animator(bubbles, mainFF);
bubbleFlow.setSideEffectOnEnd(() => {
  IGCanvas.resetAndReDrawAll();
  IGCanvas.togglePause();
  mainCanvas.togglePause();
  mainCanvas.reDrawAll();
});

// Setup flow.
const flow = new Animator(advertiserFlow, mainFF);
flow.setSideEffectOnEnd(() => {
  IGCanvas.addAnimator(bubbleFlow);
  mainCanvas.togglePause();
  IGCanvas.togglePause();
});
mainCanvas.addAnimator(flow);

mainCanvas.addGroup(
  new Group([
    mainFF.line(0, 200, 63, 200, 'blue'),
    mainFF.circle(100, 200, 75, '#EDF2EF', 'blue'),
    mainFF.image(100, 200, completedIcon, 50, 50),
  ])
);

const travellerLine = mainFF.line(0, 400, 1000, 600, 'red', false, true);
const travellerGroup = new Group([
  mainFF.line(0, 600, 1000, 800, 'blue', false),
  mainFF.line(0, 450, 1000, 900, 'green', false, true),
  mainFF.line(0, 500, 1000, 700, 'yellow', false, true),
]);

mainCanvas.addAnimator(new Animator([travellerLine, travellerGroup], mainFF));

const secondCircleAnimations = [
  mainFF.image(300, 200, userIcon, 50, 50),
  mainFF.line(295, 237, 295, 300, 'black', true, true),
  new Group([
    mainFF.box(250, 300, 100, 50, '#EDF2EF'),
    mainFF.text(300, 325, 'DSP tags'),
  ]),
  mainFF.line(295, 350, 295, 413, 'black', true, true),
  new Group([
    mainFF.box(250, 413, 100, 50, '#EDF2EF'),
    mainFF.text(300, 438, 'DSPs'),
  ]),
  mainFF.line(305, 413, 305, 350, 'black', true, true),
  mainFF.line(305, 300, 305, 237, 'black', true, true),
  mainFF.text(370, 270, 'joinInterestGroup()', 12),
];

const secondBubbles = [];
let secondStartX = 370;
let secondStartY = 270;
while (secondStartX > 0 && secondStartY > 0) {
  const circle = IGFF.circle(secondStartX, secondStartY, 10, 'orange', 'black');
  secondBubbles.push(circle);
  secondStartX -= 1;
  secondStartY -= 1;
}

const secondBubbleFlow = new Animator(secondBubbles, mainFF);
secondBubbleFlow.setSideEffectOnEnd(() => {
  IGCanvas.resetAndReDrawAll();
  IGCanvas.togglePause();
  mainCanvas.togglePause();
  mainCanvas.reDrawAll();
});

const secondFlow = new Animator(secondCircleAnimations, mainFF);
secondFlow.setSideEffectOnEnd(() => {
  IGCanvas.addAnimator(secondBubbleFlow);
  IGCanvas.togglePause();
  mainCanvas.togglePause();
});
mainCanvas.addAnimator(secondFlow);

mainCanvas.addGroup(
  new Group([
    mainFF.line(137, 200, 263, 200, 'blue'),
    mainFF.circle(300, 200, 75, '#EDF2EF', 'blue'),
    mainFF.image(300, 200, completedIcon, 50, 50),
  ])
);

// const thirdCircleAnimations = [
//   mainFF.image(500, 200, userIcon, 50, 50),
//   mainFF.line(495, 237, 495, 300, 'black', true),
//   new Group([
//     mainFF.box(450, 300, 100, 50, '#EDF2EF'),
//     mainFF.text(500, 325, 'DSP tags'),
//   ]),
//   mainFF.line(495, 350, 495, 413, 'black', true),
//   new Group([
//     mainFF.box(450, 413, 100, 50, '#EDF2EF'),
//     mainFF.text(500, 438, 'DSPs'),
//   ]),
//   mainFF.line(505, 413, 505, 350, 'black', true),
//   mainFF.line(505, 300, 505, 237, 'black', true),
//   mainFF.text(570, 270, 'joinInterestGroup()', 12),
// ];

// mainCanvas.addAnimator(new Animator(thirdCircleAnimations, mainFF));

// mainCanvas.addGroup(
//   new Group([
//     mainFF.line(337, 200, 463, 200, 'blue'),
//     mainFF.circle(500, 200, 75, '#EDF2EF', 'blue'),
//     mainFF.image(500, 200, completedIcon, 50, 50),
//   ])
// );

// const fourthCircleAnimations = [
//   mainFF.image(700, 200, userIcon, 50, 50),
//   mainFF.line(695, 237, 695, 300, 'black', true),
//   new Group([
//     mainFF.box(650, 300, 100, 50, '#EDF2EF'),
//     mainFF.text(700, 325, 'DSP tags'),
//   ]),
//   mainFF.line(695, 350, 695, 413, 'black', true),
//   new Group([
//     mainFF.box(650, 413, 100, 50, '#EDF2EF'),
//     mainFF.text(700, 438, 'DSPs'),
//   ]),
//   mainFF.line(705, 413, 705, 350, 'black', true),
//   mainFF.line(705, 300, 705, 237, 'black', true),
//   mainFF.text(770, 270, 'joinInterestGroup()', 12),
// ];

// mainCanvas.addAnimator(new Animator(fourthCircleAnimations, mainFF));

// mainCanvas.addGroup(
//   new Group([
//     mainFF.line(537, 200, 663, 200, 'blue'),
//     mainFF.circle(700, 200, 75, '#EDF2EF', 'blue'),
//     mainFF.image(700, 200, completedIcon, 50, 50),
//   ])
// );
