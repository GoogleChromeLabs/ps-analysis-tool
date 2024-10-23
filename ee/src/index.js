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
app.interestGroupInit = (p) => {
  app.ip = p;
  app.auction = { ...app.auction, ...auctions };
  app.flow = { ...app.flow, ...flow };
  app.utils = { ...app.utils, ...utils };
  app.timeline = { ...app.timeline, ...timeline };
  app.joinInterestGroup = { ...app.joinInterestGroup, ...joinInterestGroup };

  app.handlePlayPauseButttons();
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
    // eslint-disable-next-line no-await-in-loop
    await app.drawFlows(app.timeline.currentIndex);
    app.timeline.currentIndex++;
  }
  app.timeline.eraseAndRedraw();
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
    canvas.parent('ps-canvas');
    canvas.style('z-index', 0);
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
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjciIHZpZXdCb3g9IjAgMCAyNyAyNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjQ5OTkgMjYuNDE2N0MxMS43MTMxIDI2LjQxNjcgMTAuMDMzOSAyNi4wNzc2IDguNDYyNDIgMjUuMzk5NUM2Ljg5MDg5IDI0LjcyMTQgNS41MjM4OCAyMy44MDExIDQuMzYxMzggMjIuNjM4NkMzLjE5ODg4IDIxLjQ3NjEgMi4yNzg1NiAyMC4xMDkxIDEuNjAwNDQgMTguNTM3NUMwLjkyMjMxNCAxNi45NjYgMC41ODMyNTIgMTUuMjg2OCAwLjU4MzI1MiAxMy41QzAuNTgzMjUyIDExLjcxMzIgMC45MjIzMTQgMTAuMDM0MSAxLjYwMDQ0IDguNDYyNTRDMi4yNzg1NiA2Ljg5MTAxIDMuMTk4ODggNS41MjQgNC4zNjEzOCA0LjM2MTVDNS41MjM4OCAzLjE5OSA2Ljg5MDg5IDIuMjc4NjkgOC40NjI0MiAxLjYwMDU2QzEwLjAzMzkgMC45MjI0MzcgMTEuNzEzMSAwLjU4MzM3NCAxMy40OTk5IDAuNTgzMzc0QzE0Ljg5OTIgMC41ODMzNzQgMTYuMjIzMiAwLjc4Nzg4OCAxNy40NzE4IDEuMTk2OTJDMTguNzIwNCAxLjYwNTk0IDE5Ljg3MjEgMi4xNzY0MyAyMC45MjcgMi45MDgzN0wxOS4wNTQxIDQuODEzNThDMTguMjM2IDQuMjk2OTIgMTcuMzY0MiAzLjg5MzI3IDE2LjQzODUgMy42MDI2NEMxNS41MTI4IDMuMzEyMDIgMTQuNTMzMyAzLjE2NjcxIDEzLjQ5OTkgMy4xNjY3MUMxMC42MzY3IDMuMTY2NzEgOC4xOTg3IDQuMTczMTMgNi4xODU4NiA2LjE4NTk4QzQuMTczMDEgOC4xOTg4MyAzLjE2NjU5IDEwLjYzNjggMy4xNjY1OSAxMy41QzMuMTY2NTkgMTYuMzYzMiA0LjE3MzAxIDE4LjgwMTMgNi4xODU4NiAyMC44MTQxQzguMTk4NyAyMi44MjcgMTAuNjM2NyAyMy44MzM0IDEzLjQ5OTkgMjMuODMzNEMxNi4zNjMxIDIzLjgzMzQgMTguODAxMSAyMi44MjcgMjAuODE0IDIwLjgxNDFDMjIuODI2OCAxOC44MDEzIDIzLjgzMzMgMTYuMzYzMiAyMy44MzMzIDEzLjVDMjMuODMzMyAxMy4xMTI1IDIzLjgxMTcgMTIuNzI1IDIzLjc2ODcgMTIuMzM3NUMyMy43MjU2IDExLjk1IDIzLjY2MSAxMS41NzMzIDIzLjU3NDkgMTEuMjA3M0wyNS42NzM5IDkuMTA4MzdDMjUuOTEwNyA5Ljc5NzI2IDI2LjA5MzcgMTAuNTA3NyAyNi4yMjI4IDExLjIzOTZDMjYuMzUyIDExLjk3MTYgMjYuNDE2NiAxMi43MjUgMjYuNDE2NiAxMy41QzI2LjQxNjYgMTUuMjg2OCAyNi4wNzc1IDE2Ljk2NiAyNS4zOTk0IDE4LjUzNzVDMjQuNzIxMyAyMC4xMDkxIDIzLjgwMSAyMS40NzYxIDIyLjYzODUgMjIuNjM4NkMyMS40NzYgMjMuODAxMSAyMC4xMDg5IDI0LjcyMTQgMTguNTM3NCAyNS4zOTk1QzE2Ljk2NTkgMjYuMDc3NiAxNS4yODY3IDI2LjQxNjcgMTMuNDk5OSAyNi40MTY3Wk0xMS42OTE2IDE5LjQ0MTdMNi4yMDIgMTMuOTUyMUw4LjAxMDMzIDEyLjE0MzhMMTEuNjkxNiAxNS44MjVMMjQuNjA4MyAyLjg3NjA4TDI2LjQxNjYgNC42ODQ0MkwxMS42OTE2IDE5LjQ0MTdaIiBmaWxsPSIjMUE3M0U4Ii8+Cjwvc3ZnPgo='
    );
  };
};
// Define the sketch
const interestGroupSketch = (p) => {
  p.setup = () => {
    const { height, width } = calculateHeightAndWidth();
    const overlayCanvas = p.createCanvas(width, height);
    overlayCanvas.parent('overlay-canvas');
    overlayCanvas.style('z-index', 1);
    p.textSize(config.canvas.fontSize);

    (async () => {
      await app.interestGroupInit(p);
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
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjciIHZpZXdCb3g9IjAgMCAyNyAyNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjQ5OTkgMjYuNDE2N0MxMS43MTMxIDI2LjQxNjcgMTAuMDMzOSAyNi4wNzc2IDguNDYyNDIgMjUuMzk5NUM2Ljg5MDg5IDI0LjcyMTQgNS41MjM4OCAyMy44MDExIDQuMzYxMzggMjIuNjM4NkMzLjE5ODg4IDIxLjQ3NjEgMi4yNzg1NiAyMC4xMDkxIDEuNjAwNDQgMTguNTM3NUMwLjkyMjMxNCAxNi45NjYgMC41ODMyNTIgMTUuMjg2OCAwLjU4MzI1MiAxMy41QzAuNTgzMjUyIDExLjcxMzIgMC45MjIzMTQgMTAuMDM0MSAxLjYwMDQ0IDguNDYyNTRDMi4yNzg1NiA2Ljg5MTAxIDMuMTk4ODggNS41MjQgNC4zNjEzOCA0LjM2MTVDNS41MjM4OCAzLjE5OSA2Ljg5MDg5IDIuMjc4NjkgOC40NjI0MiAxLjYwMDU2QzEwLjAzMzkgMC45MjI0MzcgMTEuNzEzMSAwLjU4MzM3NCAxMy40OTk5IDAuNTgzMzc0QzE0Ljg5OTIgMC41ODMzNzQgMTYuMjIzMiAwLjc4Nzg4OCAxNy40NzE4IDEuMTk2OTJDMTguNzIwNCAxLjYwNTk0IDE5Ljg3MjEgMi4xNzY0MyAyMC45MjcgMi45MDgzN0wxOS4wNTQxIDQuODEzNThDMTguMjM2IDQuMjk2OTIgMTcuMzY0MiAzLjg5MzI3IDE2LjQzODUgMy42MDI2NEMxNS41MTI4IDMuMzEyMDIgMTQuNTMzMyAzLjE2NjcxIDEzLjQ5OTkgMy4xNjY3MUMxMC42MzY3IDMuMTY2NzEgOC4xOTg3IDQuMTczMTMgNi4xODU4NiA2LjE4NTk4QzQuMTczMDEgOC4xOTg4MyAzLjE2NjU5IDEwLjYzNjggMy4xNjY1OSAxMy41QzMuMTY2NTkgMTYuMzYzMiA0LjE3MzAxIDE4LjgwMTMgNi4xODU4NiAyMC44MTQxQzguMTk4NyAyMi44MjcgMTAuNjM2NyAyMy44MzM0IDEzLjQ5OTkgMjMuODMzNEMxNi4zNjMxIDIzLjgzMzQgMTguODAxMSAyMi44MjcgMjAuODE0IDIwLjgxNDFDMjIuODI2OCAxOC44MDEzIDIzLjgzMzMgMTYuMzYzMiAyMy44MzMzIDEzLjVDMjMuODMzMyAxMy4xMTI1IDIzLjgxMTcgMTIuNzI1IDIzLjc2ODcgMTIuMzM3NUMyMy43MjU2IDExLjk1IDIzLjY2MSAxMS41NzMzIDIzLjU3NDkgMTEuMjA3M0wyNS42NzM5IDkuMTA4MzdDMjUuOTEwNyA5Ljc5NzI2IDI2LjA5MzcgMTAuNTA3NyAyNi4yMjI4IDExLjIzOTZDMjYuMzUyIDExLjk3MTYgMjYuNDE2NiAxMi43MjUgMjYuNDE2NiAxMy41QzI2LjQxNjYgMTUuMjg2OCAyNi4wNzc1IDE2Ljk2NiAyNS4zOTk0IDE4LjUzNzVDMjQuNzIxMyAyMC4xMDkxIDIzLjgwMSAyMS40NzYxIDIyLjYzODUgMjIuNjM4NkMyMS40NzYgMjMuODAxMSAyMC4xMDg5IDI0LjcyMTQgMTguNTM3NCAyNS4zOTk1QzE2Ljk2NTkgMjYuMDc3NiAxNS4yODY3IDI2LjQxNjcgMTMuNDk5OSAyNi40MTY3Wk0xMS42OTE2IDE5LjQ0MTdMNi4yMDIgMTMuOTUyMUw4LjAxMDMzIDEyLjE0MzhMMTEuNjkxNiAxNS44MjVMMjQuNjA4MyAyLjg3NjA4TDI2LjQxNjYgNC42ODQ0MkwxMS42OTE2IDE5LjQ0MTdaIiBmaWxsPSIjMUE3M0U4Ii8+Cjwvc3ZnPgo='
    );
  };
};

const calculateHeightAndWidth = () => {
  const circleSpace =
    config.timeline.circleProps.verticalSpacing +
    config.timeline.circleProps.diameter;
  const rippleRadius =
    config.rippleEffect.maxRadius * 2 +
    (config.rippleEffect.numRipples - 1) * 40;
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

  const auctionBoxesWidth =
    config.flow.box.width +
    config.flow.mediumBox.width * 2 +
    config.flow.lineWidth * 2;
  const interestGroupWidth = config.flow.box.width;
  let maxXposition =
    config.timeline.position.x + circleSpace * config.timeline.circles.length;

  config.timeline.circles.forEach((circle, index) => {
    const xPos = config.timeline.position.x + circleSpace * index;

    if (circle.type === 'publisher') {
      maxXposition = Math.max(maxXposition, xPos + auctionBoxesWidth);
    } else {
      maxXposition = Math.max(maxXposition, xPos + interestGroupWidth);
    }
  });

  return {
    height,
    width: maxXposition,
  };
};

// eslint-disable-next-line no-new
new p5(sketch);
// eslint-disable-next-line no-new
new p5(interestGroupSketch);
