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

const prevbutton = mainFF.box({
  x: 10,
  y: 10,
  width: 100,
  height: 50,
  fill: 'blue',
  stroke: 'black',
  mouseClicked: () => {
    mainCanvas.loadPreviousCheckpoint();
  },
});

const nextbutton = mainFF.box({
  x: 150,
  y: 10,
  width: 100,
  height: 50,
  fill: 'blue',
  stroke: 'black',
  mouseClicked: () => {
    mainCanvas.loadNextCheckpoint();
  },
});

const reset = mainFF.box({
  x: 290,
  y: 10,
  width: 100,
  height: 50,
  fill: 'blue',
  stroke: 'black',
  mouseClicked: () => {
    mainCanvas.reset();
  },
});

mainCanvas.addFigure(reset, false, true);
mainCanvas.addFigure(prevbutton);
mainCanvas.addFigure(nextbutton);

const timeline = mainFF.line({
  x: 0,
  y: 200,
  endX: 1000,
  endY: 200,
  stroke: 'black',
  shouldTravel: true,
});

const circles = [
  new Group([
    mainFF.circle({
      x: 100,
      y: 200,
      diameter: 75,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 100,
      y: 75,
      text: '2024-01-01',
    }),
    mainFF.text({
      x: 100,
      y: 100,
      text: 'adv1.com',
    }),
    mainFF.line({
      x: 100,
      y: 163,
      endX: 100,
      endY: 110,
      stroke: 'black',
    }),
  ]),
  new Group([
    mainFF.circle({
      x: 300,
      y: 200,
      diameter: 75,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 300,
      y: 75,
      text: '2024-01-02',
    }),
    mainFF.text({
      x: 300,
      y: 100,
      text: 'adv2.com',
    }),
    mainFF.line({
      x: 300,
      y: 163,
      endX: 300,
      endY: 110,
      stroke: 'black',
    }),
  ]),
  new Group([
    mainFF.circle({
      x: 500,
      y: 200,
      diameter: 75,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 500,
      y: 75,
      text: '2024-01-03',
    }),
    mainFF.text({
      x: 500,
      y: 100,
      text: 'adv3.com',
    }),
    mainFF.line({
      x: 500,
      y: 163,
      endX: 500,
      endY: 110,
      stroke: 'black',
    }),
  ]),
  new Group([
    mainFF.circle({
      x: 700,
      y: 200,
      diameter: 75,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 700,
      y: 75,
      text: '2024-01-04',
    }),
    mainFF.text({
      x: 700,
      y: 100,
      text: 'adv4.com',
    }),
    mainFF.line({
      x: 700,
      y: 163,
      endX: 700,
      endY: 110,
      stroke: 'black',
    }),
  ]),
];

const userIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg==';

const completedIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNTk4NUUxIj48cGF0aCBkPSJNNDgwLTgwcS04NSAwLTE1OC0zMC41VDE5NS0xOTVxLTU0LTU0LTg0LjUtMTI3VDgwLTQ4MHEwLTg0IDMwLjUtMTU3VDE5NS03NjRxNTQtNTQgMTI3LTg1dDE1OC0zMXE3NSAwIDE0MCAyNHQxMTcgNjZsLTQzIDQzcS00NC0zNS05OC01NHQtMTE2LTE5cS0xNDUgMC0yNDIuNSA5Ny41VDE0MC00ODBxMCAxNDUgOTcuNSAyNDIuNVQ0ODAtMTQwcTE0NSAwIDI0Mi41LTk3LjVUODIwLTQ4MHEwLTMwLTQuNS01OC41VDgwMi01OTRsNDYtNDZxMTYgMzcgMjQgNzd0OCA4M3EwIDg1LTMxIDE1OHQtODUgMTI3cS01NCA1NC0xMjcgODQuNVQ0ODAtODBabS01OS0yMThMMjU2LTQ2NGw0NS00NSAxMjAgMTIwIDQxNC00MTQgNDYgNDUtNDYwIDQ2MFoiLz48L3N2Zz4=';

const advertiserFlow = [
  mainFF.image({
    x: 100,
    y: 200,
    imageData: userIcon,
    width: 50,
    height: 50,
  }),
  mainFF.line({
    x: 95,
    y: 237,
    endX: 95,
    endY: 300,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  new Group([
    mainFF.box({
      x: 50,
      y: 300,
      width: 100,
      height: 50,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 100,
      y: 325,
      text: 'DSP tags',
    }),
  ]),
  mainFF.line({
    x: 95,
    y: 350,
    endX: 95,
    endY: 413,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  new Group([
    mainFF.box({
      x: 50,
      y: 413,
      width: 100,
      height: 50,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 100,
      y: 438,
      text: 'DSPs',
    }),
  ]),
  mainFF.line({
    x: 105,
    y: 413,
    endX: 105,
    endY: 350,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  mainFF.line({
    x: 105,
    y: 300,
    endX: 105,
    endY: 237,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  mainFF.text({
    x: 170,
    y: 270,
    text: 'joinInterestGroup()',
    size: 12,
  }),
];

// Setup timeline.
mainCanvas.addFigure(timeline);
circles.forEach((circle) => mainCanvas.addGroup(circle));

// add IG bubble canvas here
// pause the main canvas operations
// add elements to IG canvas
const bubbles = [];
let startX = 170;
let startY = 270;
let lerpSpeed = 0.01;
while (Math.floor(startX) > 0 && Math.floor(startY) > 0) {
  const circle = IGFF.circle({
    x: startX,
    y: startY,
    diameter: 10,
    fill: 'orange',
    stroke: 'black',
  });
  bubbles.push(circle);
  startX = IGCanvas.getP5Instance().lerp(startX, 0, lerpSpeed);
  startY = IGCanvas.getP5Instance().lerp(startY, 0, lerpSpeed);
  lerpSpeed += 0.0003;
}

const bubbleFlow = new Animator(bubbles, mainFF);
bubbleFlow.setSideEffectOnEnd(() => {
  IGCanvas.resetQueuesAndReDrawAll();
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
mainCanvas.addAnimator(flow, false, true);

mainCanvas.addGroup(
  new Group([
    mainFF.line({
      x: 0,
      y: 200,
      endX: 63,
      endY: 200,
      stroke: 'blue',
    }),
    mainFF.circle({
      x: 100,
      y: 200,
      diameter: 75,
      fill: '#EDF2EF',
      stroke: 'blue',
    }),
    mainFF.image({
      x: 100,
      y: 200,
      imageData: completedIcon,
      width: 50,
      height: 50,
    }),
  ]),
  false
);

const travellerLine = mainFF.line({
  x: 0,
  y: 400,
  endX: 1000,
  endY: 400,
  stroke: 'red',
  shouldTravel: true,
});

const travellerGroup = new Group([
  mainFF.line({
    x: 0,
    y: 600,
    endX: 1000,
    endY: 800,
    stroke: 'blue',
  }),
  mainFF.line({
    x: 0,
    y: 450,
    endX: 1000,
    endY: 900,
    stroke: 'green',
    shouldTravel: true,
  }),
  mainFF.line({
    x: 0,
    y: 500,
    endX: 1000,
    endY: 700,
    stroke: 'yellow',
    shouldTravel: true,
  }),
]);

mainCanvas.addAnimator(
  new Animator([travellerLine, travellerGroup], mainFF),
  false,
  true
);

const secondCircleAnimations = [
  mainFF.image({
    x: 300,
    y: 200,
    imageData: userIcon,
    width: 50,
    height: 50,
  }),
  mainFF.line({
    x: 295,
    y: 237,
    endX: 295,
    endY: 300,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  new Group([
    mainFF.box({
      x: 250,
      y: 300,
      width: 100,
      height: 50,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 300,
      y: 325,
      text: 'DSP tags',
    }),
  ]),
  mainFF.line({
    x: 295,
    y: 350,
    endX: 295,
    endY: 413,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  new Group([
    mainFF.box({
      x: 250,
      y: 413,
      width: 100,
      height: 50,
      fill: '#EDF2EF',
    }),
    mainFF.text({
      x: 300,
      y: 438,
      text: 'DSPs',
    }),
  ]),
  mainFF.line({
    x: 305,
    y: 413,
    endX: 305,
    endY: 350,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  mainFF.line({
    x: 305,
    y: 300,
    endX: 305,
    endY: 237,
    stroke: 'black',
    hasArrow: true,
    shouldTravel: true,
  }),
  mainFF.text({
    x: 370,
    y: 270,
    text: 'joinInterestGroup()',
    size: 12,
  }),
];

const secondBubbles = [];
let secondStartX = 370;
let secondStartY = 270;
lerpSpeed = 0.01;
while (Math.floor(secondStartX) > 0 && Math.floor(secondStartY) > 0) {
  const circle = IGFF.circle({
    x: secondStartX,
    y: secondStartY,
    diameter: 10,
    fill: 'orange',
    stroke: 'black',
  });

  secondBubbles.push(circle);
  secondStartX = IGCanvas.getP5Instance().lerp(secondStartX, 0, lerpSpeed);
  secondStartY = IGCanvas.getP5Instance().lerp(secondStartY, 0, lerpSpeed);
  lerpSpeed += 0.0003;
}

const secondBubbleFlow = new Animator(secondBubbles, mainFF);
secondBubbleFlow.setSideEffectOnEnd(() => {
  IGCanvas.resetQueuesAndReDrawAll();
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
mainCanvas.addAnimator(secondFlow, false, true);

mainCanvas.addGroup(
  new Group([
    mainFF.line({
      x: 137,
      y: 200,
      endX: 263,
      endY: 200,
      stroke: 'blue',
    }),
    mainFF.circle({
      x: 300,
      y: 200,
      diameter: 75,
      fill: '#EDF2EF',
      stroke: 'blue',
    }),
    mainFF.image({
      x: 300,
      y: 200,
      imageData: completedIcon,
      width: 50,
      height: 50,
    }),
  ]),
  false
);
