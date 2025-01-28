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
import app from '../../../app';
import config from '../../../config';
import { Box, ProgressLine } from '../../../components';

const setUpPublisherAdServerFlow = (steps) => {
  const { box } = config.flow;

  steps.push({
    component: Box,
    props: {
      title: 'Publisher',
      description: 'Ad server tag',
      x: () => app.auction.nextTipCoordinates?.x + 10,
      y: () => app.auction.nextTipCoordinates?.y - box.height / 2,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () => app.auction.nextTipCoordinates?.x + box.width / 2,
      y1: () => app.auction.nextTipCoordinates?.y + 10,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'Publisher',
      description: 'Ad server',
      x: () => app.auction.nextTipCoordinates?.x + 10,
      y: () => app.auction.nextTipCoordinates?.y - 23,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'left',
      x1: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y1: () => app.auction.nextTipCoordinates?.y + 20,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x - box.width / 2 - 10,
      y1: () => app.auction.nextTipCoordinates?.y + box.height / 2 - 5,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'runAdAuction',
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + box.height / 4,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });
};

export default setUpPublisherAdServerFlow;
