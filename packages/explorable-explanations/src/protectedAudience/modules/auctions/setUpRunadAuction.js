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

const setUpRunadAuction = (auction) => {
  const { box, colors } = config.flow;

  auction.steps.push({
    component: Box,
    props: {
      title: 'runAdAuction',
      x: () => app.auction.nextTipCoordinates?.x + 10,
      y: () => app.auction.nextTipCoordinates?.y - box.height / 2,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  const boxes = [
    {
      title: 'Load Interest Group',
      extraProps: {
        showBarrageAnimation: true,
      },
    },
    {
      title: 'Key/Value Trusted',
      description: 'DSP Server',
      color: colors.box.notBrowser,
    },
    {
      title: 'generateBid()',
      description: '(from DSPs on dsp.js)',
      color: colors.box.notBrowser,
      extraProps: {
        showRippleEffect: true,
      },
    },
    {
      title: 'DSP 1',
    },
    {
      title: 'DSP 2',
    },
    {
      title: 'Key/Value Trusted',
      description: 'SSP Server',
    },
    {
      title: 'scoreAd()',
      description: '(by SSPs on ssp.js)',
    },
    {
      title: 'reportWin()',
      description: '(on dsp.js)',
      color: colors.box.notBrowser,
    },
    {
      title: 'reportResult()',
      description: '(on ssp.js)',
    },
  ];

  boxes.forEach(({ title, description, color, extraProps = {} }) => {
    if (title === 'DSP 1') {
      auction.steps.push({
        component: ProgressLine,
        props: {
          direction: 'right',
          x1: () => app.auction.nextTipCoordinates?.x + box.width / 2,
          y1: () => {
            return app.auction.nextTipCoordinates?.y - box.height / 2 + 15;
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue;
        },
      });

      auction.steps.push({
        component: Box,
        props: {
          title,
          x: () => app.auction.nextTipCoordinates?.x + 10,
          y: () => app.auction.nextTipCoordinates?.y - box.height + 15,
          color,
        },
        delay: 1000,
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue.down;
        },
      });

      auction.steps.push({
        component: ProgressLine,
        props: {
          direction: 'left',
          text: '$20',
          x1: () => app.auction.nextTipCoordinates?.x + box.width / 4 + 5,
          y1: () => {
            return app.auction.nextTipCoordinates?.y + 25;
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue;
        },
      });
      return;
    }

    if (title === 'DSP 2') {
      auction.steps.push({
        component: ProgressLine,
        props: {
          direction: 'right',
          x1: () => app.auction.nextTipCoordinates?.x - 7,
          y1: () => {
            return app.auction.nextTipCoordinates?.y + box.height / 2 - 5;
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue;
        },
      });

      auction.steps.push({
        component: Box,
        props: {
          title,
          x: () => app.auction.nextTipCoordinates?.x + 10,
          y: () => app.auction.nextTipCoordinates?.y,
          color,
        },
        delay: 1000,
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue.down;
        },
      });

      auction.steps.push({
        component: ProgressLine,
        props: {
          direction: 'left',
          text: '$10',
          x1: () => app.auction.nextTipCoordinates?.x + box.width / 4 + 5,
          y1: () => {
            return app.auction.nextTipCoordinates?.y + 15 - box.height / 2;
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = {
            x: returnValue.x - box.width / 2 - 10,
            y: returnValue.y - (box.height / 4) * 3,
          };
        },
      });
      return;
    }

    auction.steps.push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: () => app.auction.nextTipCoordinates?.x,
        y1: () => {
          return app.auction.nextTipCoordinates?.y + box.height - 10;
        },
      },
      callBack: (returnValue) => {
        app.auction.nextTipCoordinates = returnValue;
      },
    });

    auction.steps.push({
      component: Box,
      props: {
        title,
        description,
        ...extraProps,
        x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
        y: () => app.auction.nextTipCoordinates?.y + 10,
        color,
      },
      delay: 1000,
      callBack: (returnValue) => {
        app.auction.nextTipCoordinates = returnValue.down;
      },
    });
  });
};

export default setUpRunadAuction;
