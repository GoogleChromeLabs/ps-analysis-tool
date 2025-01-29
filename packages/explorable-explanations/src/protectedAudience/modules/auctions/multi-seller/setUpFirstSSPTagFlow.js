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
import { MULTI_SELLER_CONFIG } from '../../flowConfig.jsx';

const setUpMultiSellerFirstSSPTagFlow = (steps) => {
  const { box, colors } = config.flow;

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: MULTI_SELLER_CONFIG.SSP_ADAPTER_HEADER_BIDDING.title,
      description: MULTI_SELLER_CONFIG.SSP_ADAPTER_HEADER_BIDDING.description,
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y,
      info: MULTI_SELLER_CONFIG.SSP_ADAPTER_HEADER_BIDDING.info,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: MULTI_SELLER_CONFIG.SSPs.title,
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + config.flow.arrowSize,
      color: colors.box.notBrowser,
      info: MULTI_SELLER_CONFIG.SSPs.info,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: MULTI_SELLER_CONFIG.DSPs.title,
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + config.flow.arrowSize,
      color: colors.box.notBrowser,
      info: MULTI_SELLER_CONFIG.DSPs.info,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => app.auction.nextTipCoordinates?.x + 10,
      y1: () => {
        return app.auction.nextTipCoordinates?.y - 15;
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => {
        return app.auction.nextTipCoordinates?.y - box.height - 10;
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () => app.auction.nextTipCoordinates?.x - 10 + box.width / 2,
      y1: () => {
        return app.auction.nextTipCoordinates?.y - 10 - box.height / 2;
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

export default setUpMultiSellerFirstSSPTagFlow;
