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
import app from '../../app';
import config from '../../config';
import { Box, ProgressLine } from '../../components';
import { SINGLE_SELLER_CONFIG } from '../flowConfig.tsx';
import type { AuctionStep } from '../../types.ts';
import { getCoordinateValues } from '../../utils/getCoordinateValues.ts';

const setUpRunadAuction = (
  steps: AuctionStep[],
  afterRippleStep: (() => AuctionStep) | null = null,
  ssp = ''
) => {
  const { box, colors } = config.flow;

  steps.push({
    component: Box,
    props: {
      title: SINGLE_SELLER_CONFIG.RUN_AD_AUCTION.title,
      ssp,
      x: () => getCoordinateValues(app.auction.nextTipCoordinates).x + 10,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y - box.height / 2,
      info: SINGLE_SELLER_CONFIG.RUN_AD_AUCTION.info,
    },
    delay: 1000,
    callBack: (returnValue) => {
      if (returnValue.down) {
        app.auction.nextTipCoordinates = returnValue.down;
      }
    },
  });

  const boxes = [
    {
      title: SINGLE_SELLER_CONFIG.LOAD_INTEREST_GROUP.title,
      extraProps: {
        showBarrageAnimation: true,
      },
      info: SINGLE_SELLER_CONFIG.LOAD_INTEREST_GROUP.info,
    },
    {
      title: SINGLE_SELLER_CONFIG.KEY_VALUE_DSP_SERVER.title,
      description: SINGLE_SELLER_CONFIG.KEY_VALUE_DSP_SERVER.description,
      info: SINGLE_SELLER_CONFIG.KEY_VALUE_DSP_SERVER.info,
    },
    {
      title: SINGLE_SELLER_CONFIG.GENERATE_BID.title,
      description: SINGLE_SELLER_CONFIG.GENERATE_BID.description,
      extraProps: {
        showRippleEffect: true,
      },
      info: SINGLE_SELLER_CONFIG.GENERATE_BID.info,
    },
    {
      title: 'DSP 1',
      info: SINGLE_SELLER_CONFIG.DSP_X.info,
    },
    {
      title: 'DSP 2',
      info: SINGLE_SELLER_CONFIG.DSP_X.info,
    },
    {
      title: SINGLE_SELLER_CONFIG.KEY_VALUE_SSP_SERVER.title,
      description: SINGLE_SELLER_CONFIG.KEY_VALUE_SSP_SERVER.description,
      info: SINGLE_SELLER_CONFIG.KEY_VALUE_SSP_SERVER.info,
      color: colors.box.yellowBox,
    },
    {
      title: SINGLE_SELLER_CONFIG.SCORE_AD.title,
      description: SINGLE_SELLER_CONFIG.SCORE_AD.description,
      info: SINGLE_SELLER_CONFIG.SCORE_AD.info,
      color: colors.box.yellowBox,
    },
    {
      title: SINGLE_SELLER_CONFIG.REPORT_WIN.title,
      description: SINGLE_SELLER_CONFIG.REPORT_WIN.description,
      info: SINGLE_SELLER_CONFIG.REPORT_WIN.info,
    },
    {
      title: SINGLE_SELLER_CONFIG.REPORT_RESULT.title,
      description: SINGLE_SELLER_CONFIG.REPORT_RESULT.description,
      info: SINGLE_SELLER_CONFIG.REPORT_RESULT.info,
      color: colors.box.yellowBox,
    },
  ];

  boxes.forEach(({ title, description, color, info, extraProps = {} }) => {
    if (title === 'DSP 1') {
      if (afterRippleStep) {
        steps.push(afterRippleStep());
      }

      steps.push({
        component: ProgressLine,
        props: {
          direction: 'right',
          x1: () =>
            getCoordinateValues(app.auction.nextTipCoordinates).x +
            box.width / 2,
          y1: () => {
            return (
              getCoordinateValues(app.auction.nextTipCoordinates).y -
              box.height / 2 +
              15
            );
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue;
        },
      });

      steps.push({
        component: Box,
        props: {
          title,
          ssp,
          x: () => getCoordinateValues(app.auction.nextTipCoordinates).x + 10,
          y: () =>
            getCoordinateValues(app.auction.nextTipCoordinates).y -
            box.height +
            15,
          color,
          info,
        },
        delay: 1000,
        callBack: (returnValue) => {
          if (returnValue.down) {
            app.auction.nextTipCoordinates = returnValue.down;
          }
        },
      });

      steps.push({
        component: ProgressLine,
        props: {
          direction: 'left',
          text: '$20',
          x1: () =>
            getCoordinateValues(app.auction.nextTipCoordinates).x -
            box.width / 2,
          y1: () => {
            return getCoordinateValues(app.auction.nextTipCoordinates).y + 35;
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue;
        },
      });
      return;
    }

    if (title === 'DSP 2') {
      steps.push({
        component: ProgressLine,
        props: {
          direction: 'right',
          x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x - 7,
          y1: () => {
            return (
              getCoordinateValues(app.auction.nextTipCoordinates).y +
              box.height / 2 -
              5
            );
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue;
        },
      });

      steps.push({
        component: Box,
        props: {
          title,
          ssp,
          x: () => getCoordinateValues(app.auction.nextTipCoordinates).x + 10,
          y: () => getCoordinateValues(app.auction.nextTipCoordinates).y,
          color,
          info,
        },
        delay: 1000,
        callBack: (returnValue) => {
          if (returnValue.down) {
            app.auction.nextTipCoordinates = returnValue.down;
          }
        },
      });

      steps.push({
        component: ProgressLine,
        props: {
          direction: 'left',
          text: '$10',
          x1: () =>
            getCoordinateValues(app.auction.nextTipCoordinates).x -
            box.width / 2,
          y1: () => {
            return (
              getCoordinateValues(app.auction.nextTipCoordinates).y +
              25 -
              box.height / 2
            );
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = {
            x: getCoordinateValues(returnValue).x - box.width / 2 - 10,
            y: getCoordinateValues(returnValue).y - (box.height / 4) * 3,
          };
        },
      });
      return;
    }

    steps.push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
        y1: () => {
          return (
            getCoordinateValues(app.auction.nextTipCoordinates).y +
            box.height -
            10
          ); // @todo ty coordinate change must not affect the component boxes in multi seller.
        },
      },
      callBack: (returnValue) => {
        app.auction.nextTipCoordinates = returnValue;
      },
    });

    steps.push({
      component: Box,
      props: {
        title,
        description,
        ssp,
        ...extraProps,
        x: () =>
          getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
        y: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 10,
        color,
        info,
      },
      delay: 1000,
      callBack: (returnValue) => {
        if (returnValue.down) {
          app.auction.nextTipCoordinates = returnValue.down;
        }
      },
    });
  });
};

export default setUpRunadAuction;
