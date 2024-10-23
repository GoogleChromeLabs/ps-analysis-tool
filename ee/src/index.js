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
 * External dependencies.
 */
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import config from './config.js';
import app from './app.js';
import auctions from './modules/auctions.js';
import flow from './modules/flow.js';
import utils from './modules/utils.js';
import timeline from './modules/timeline.js';
import joinInterestGroup from './modules/join-interest-group.js';

app.init = (p) => {
  app.p = p;
  app.auction = { ...app.auction, ...auctions };
  app.flow = { ...app.flow, ...flow };
  app.utils = { ...app.utils, ...utils };
  app.timeline = { ...app.timeline, ...timeline };
  app.joinInterestGroup = { ...app.joinInterestGroup, ...joinInterestGroup };

  app.handlePlayPauseButttons();

  timeline.init();

  app.auction.setupAuctions();
  app.joinInterestGroup.setupJoinings();

  app.play();
};

app.play = () => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.timeline.isPaused = false;
  app.setupLoop();
};

app.pause = () => {
  app.pauseButton.classList.add('hidden');
  app.playButton.classList.remove('hidden');
  app.timeline.isPaused = true;
};

app.setupLoop = async () => {
  while (
    !app.timeline.isPaused &&
    app.timeline.currentIndex < config.timeline.circles.length
  ) {
    app.timeline.renderUserIcon();
    // eslint-disable-next-line no-await-in-loop -- @todo: Fix
    await app.drawFlows(app.timeline.currentIndex);
    app.timeline.currentIndex++;
  }
};

app.drawFlows = async (index) => {
  await app.joinInterestGroup.draw(index);
  await app.auction.draw(index);
};

app.handlePlayPauseButttons = () => {
  app.playButton = document.getElementById('play');
  app.pauseButton = document.getElementById('pause');

  app.playButton.addEventListener('click', app.play);
  app.pauseButton.addEventListener('click', app.pause);
};

// Define the sketch
const sketch = (p) => {
  p.setup = () => {
    const { height, width } = calculateHeightAndWidth();
    const canvas = p.createCanvas(width, height);
    const overlayCanvas = p.createCanvas(width, height);
    canvas.parent('ps-canvas');
    canvas.style('z-index', 0);
    overlayCanvas.parent('ps-canvas');
    overlayCanvas.style('z-index', 1);
    p.background(config.canvas.background);
    p.textSize(config.canvas.fontSize);

    (async () => {
      await app.init(p);
    })();
  };

  p.preload = () => {
    p.userIcon = p.loadImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg=='
    );
    p.playIcon = p.loadImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAqhJREFUeF7tm1FuwkAMRDcnKz0JSPCRW5Tego8ilZNAT0a7KEh8FBQnseyZnf7W2GSeZ9e4tCv6CVWgC62u4kUAgptAAAQgWIHg8nKAAAQrEFxeDhCAYAWCy8sBAhCsQHB5OUAAghUILi8HCECwAsHl5QABCFYguLwcIADBCgSXlwNaB7DZ9fvvr8M+WIew8uEOWG/7a336riufLYJIA6BVCKkA3M+BltyQEsAA4tJ15Yf9WMoM4MaB3Q3pAbAfSzAAWN0ABYDRDZAAmNwAC4DFDfAA0EdWFgCwIysVAMRjiRIA0iWdHsDpeOjqyvp6LR9TdsbZP0lDAKjCb3b9aoCwsoLIDAEGwF10NjfAAVgARKotKyyA4ViCvxugASzghvB1NwUAZDfQAEB1Ax2ABze8lVLSj6yUAJDcQA1gARDuI2sTADJf0s0AWMANLiNrcwDW2/485XL+e009jurXJy/WXdSr+GYAZN0h0QOYs0X16vpHR1ADyNr19ACydz01AISupwQwt+tPx8P7ktPN2FwUd0C20XKs+LcvD1iCPWLv/6L0LHf9o/yz36EdN/89BySAuceNxweqqc0JB4Ch6yEvYaauhwPA1vVQAOo6YOryLGq0tNwH6e8Ay8MMsS5bywnvY9RLqABk/griMxosAKC6Hu0OeGllxK5nAQDb9fAA0LseGcAFYbQcNf4MQSiXMMVxA7mMYzpu0ADQdn36O4C96zMDaKLrUwJoqeuzATizjZZQY6jlzTLGhn8OYBTV8kwCYFHLIVYAHES1pBQAi1oOsQLgIKolpQBY1HKIFQAHUS0pBcCilkOsADiIakkpABa1HGIFwEFUS0oBsKjlECsADqJaUgqARS2HWAFwENWSUgAsajnECoCDqJaUAmBRyyFWABxEtaT8BZvYv3DZ9JHwAAAAAElFTkSuQmCC'
    );
    p.pauseIcon = p.loadImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAZhJREFUeF7tm00OgjAQRoeb6Ukk0QW3UG/BAhM8idwMg9EgP+1IpyVGn4mrqlOfrx8w1Ex4eAlk8PETAJBiCIAAZAsRDMIgDLIRwCAbPzIIgzDIRgCDbPzIoFQG5YdiIyLd0/po6qps5j5kjRra5IMNyg/FqW3lqBXQxrNMznVVnhyAktdQ56e9wDUOIIUcgAD0IJAig2YD98l7EuqBGRSthhYxsQE110u5dRXd7Yt2PBYC6HopnfPe7Yvb+OjqqwGgbpl4jpQAAtDQAZaYiJBBTylc51oAAlCfGxzm3zKU8yARThRfQjgCFEAA0s69/UcYDMIgDBoQoN2hCAEgANEPGjhAu4N2Ry8E7Q6lHQogAE36xdz24b4YF6ufXYzRDwrbvEC7g3bHZytMWGIssST7g8ggJYO64Wibmzzb/KLV0BIldsNMqzcZD7mzurTIN+0PWjp37+amNTaKahPGoJVbrtoP8ldLjL8iLNbhB98QnEE/yGL2KwEoVUhj0L8QwCDbL00GYRAG2QhgkI0fGYRBGGQjgEE2fnfmq4R2jqXwowAAAABJRU5ErkJggg=='
    );
    p.completedCheckMark = p.loadImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALzSURBVHgBrZZdUtswEIB3ZSdApw/uS4ck7Yw5QcMN0hPADQgnwE146FvDW2daIJwAOEGHEzQ3IDdAL5DASzNlpqSxLaF1LMcyEDsZdsagSLK+3fX+CKGguJ0rZ3K/0kCGjp5DCdx+O+7zzsaoyBmYB/D/rjXVri0J0JhzSh+FPLk+qpzBMrBaa6Ag7FiCdKC4cJTy4CWonZ2YuusNQZoAMtYIlZvCc2DYB9/qlyAcBTa4KJkTgthGYFuxUq5x1teBOwnwFyLbvf7xvv/Esur+8FIx6hoiUB6sBA9nvPvyd1n3Bi6zoYkCuLYqAvn4O1ZgJEK5acBqreGxRPC0S9SGz8NuhcOCkgEpB8mDm6NKB2egQVMinmpQOXzYnGfNoiAaMr1Jgb5ByqLXBiWwKPLiDRRNr+m69J6pZYztxb95Xq4sA6q0hlEcMNf740gp69Np7MGCkgeqtm9PEeGYUooF9rieevcCFpA80Mf27TZE+QqgcrfBVKi7epGhMIKi1r7boWcZEInFfK7HyITD0otBADwNkiDO6MkCi4BIxr5lKG/ArJI1q4MyTHIwDSwKIrFts3wxJliKHibfj6JSpcFuGlhtDTpFQSRUO2dj4MwKy71kVch0sDwBwjTx3Rh/Pg8UHQewpcfU9xjvvhup0OxNtWc7FKJzgRp0WGlCjqhO0IiVjBosi1XQIe/8p2aZERNYDGRUJSFOov/0hxLbtyZXcU8alUtyk39/WrLW9weN4c9KL4eTDSJ+c7i+QfORZeRKkOKLto42Zt1JUghEzTcVRFRr9VoS+pGrlIv0O5P7tUvSEBaQyCL1XgICYdxLjDwrhaue6s79BKg0jH2fa82H9t2e77MERJeg68Oql9737IWn1r7pqsjcS01xpURPQnjBEEe2qjR+VABUXkr8pJ6meTGS5+Vw7GV74tzblTTyKl+ii5H69i+1Kcw7IHKj6nezNvTMIZSnKn1KYv7FKBemxfWunMBerRtdQpU6K/zXK3qFeATg+dWyM/0APQAAAABJRU5ErkJggg=='
    );
  };
};

const calculateHeightAndWidth = () => {
  const circleSpace =
    config.timeline.circleProps.verticalSpacing +
    config.timeline.circleProps.diameter;
  const rippleRadius =
    config.ripple.maxRadius * 2 + (config.ripple.numRipples - 1) * 40;
  const maxHeightUsingBoxAndLine =
    config.flow.lineWidth * 2 +
    config.flow.box.height +
    config.flow.smallBox.height;
  const height =
    config.timeline.position.y +
    circleSpace +
    (rippleRadius > maxHeightUsingBoxAndLine
      ? rippleRadius
      : maxHeightUsingBoxAndLine);

  const width =
    config.timeline.position.x + circleSpace * config.timeline.circles.length;

  return {
    height,
    width,
  };
};

// Initialize the sketch
// eslint-disable-next-line no-new
new p5(sketch);
