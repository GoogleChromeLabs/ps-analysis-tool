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
import flow from './flow';
import app from '../app';
import config from '../config';
import utils from './utils';
import timeline from './timeline';
import Box from '../components/box';
import ProgressLine from '../components/progressLine';

const joinInterestGroup = {};
const ARROW_SIZE = 10;

joinInterestGroup.setupJoinings = () => {
  config.timeline.circles.forEach((circle, index) => {
    joinInterestGroup.setUp(index);
  });
};

joinInterestGroup.setUp = (index) => {
  const { circles } = config.timeline;
  const { box } = config.flow;
  const currentCircle = circles[index];

  const { x, y } = flow.getTimelineCircleCoordinates(index);

  if (currentCircle.type !== 'advertiser') {
    app.joinInterestGroup.joinings.push(null);
    return;
  }

  const steps = [];

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: x,
      y1: y,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'DSP Tag',
      x: () => app.auction.nextTipCoordinates.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates.y + ARROW_SIZE,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates.x,
      y1: () => app.auction.nextTipCoordinates.y + 40,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'DSPs',
      x: () => app.auction.nextTipCoordinates.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates.y + config.flow.arrowSize,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => app.auction.nextTipCoordinates.x + 10,
      y1: () => app.auction.nextTipCoordinates.y - 15,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => app.auction.nextTipCoordinates.x,
      y1: () => app.auction.nextTipCoordinates.y - 10 - box.height,
      text: 'joinInterestGroup()',
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  app.joinInterestGroup.joinings.push(steps);
};

joinInterestGroup.draw = async (index) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);

  const steps = app.joinInterestGroup.joinings[index];

  if (!steps) {
    return;
  }

  for (const step of steps) {
    const { component, props, callBack } = step;
    const returnValue = await component(props); // eslint-disable-line no-await-in-loop
    const delay = component === Box ? 1000 : 0;

    if (callBack) {
      callBack(returnValue);
    }

    await utils.delay(delay); // eslint-disable-line no-await-in-loop
  }

  flow.clearBelowTimelineCircles();

  timeline.drawSmallCircles(index);
};

joinInterestGroup.remove = (index) => {
  const { dspTags, dsp } = app.joinInterestGroup.joinings[index];
  const x1 = dsp[0]?.box?.x - 10;
  const y1 = dspTags[0]?.line?.y1;
  const x2 = dspTags[0]?.box?.x + config.flow.box.width * 2;

  const height =
    config.flow.box.height +
    config.flow.smallBox.height +
    config.flow.lineWidth +
    config.timeline.circleProps.diameter;

  flow.createOverrideBox(x1, y1, x2, height);
};

export default joinInterestGroup;
