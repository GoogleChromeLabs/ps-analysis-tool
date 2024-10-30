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
// @ts-nocheck

/**
 * Setup function for p5.js
 * @param {*} p - p5.js instance
 */
export function p5Setup(p) {
  const config = {
    canvas: {
      width: 2000,
    },
    timeline: {
      position: { x: 160, y: 100 },
      circleProps: {
        diameter: 50,
        verticalSpacing: 80,
      },
      stepDelay: 1500,
      user: {
        width: 30,
        height: 30,
      },
      circles: [],
    },
  };

  let userIcon;

  const app = {
    isPaused: false,
    circlePositions: [[], [], []],
    currentIndex: 0,
    epochIndex: 0,
    weekCount: 1,
    internval: undefined,
    visitedTopics: [[], [], []],
    topicsVisitCount: [{}, {}, {}],
    siteAdtechs: {},
    utils: {},
  };

  const websites = [
    'example-news.com',
    'tech-insights.com',
    'daily-sports.com',
    'health-today.com',
    'travel-guide.com',
    'foodie-heaven.com',
    'fashion-hub.com',
    'business-world.com',
    'education-portal.com',
    'entertainment-zone.com',
    'global-news.com',
    'tech-trends.com',
    'sports-daily.com',
    'wellness-today.com',
    'world-traveler.com',
    'gourmet-paradise.com',
    'style-hub.com',
    'finance-world.com',
    'learning-portal.com',
    'fun-zone.com',
  ];

  const websiteToTopicMapping = {
    'example-news.com': 'news',
    'tech-insights.com': 'technology',
    'daily-sports.com': 'sports',
    'health-today.com': 'health',
    'travel-guide.com': 'travel',
    'foodie-heaven.com': 'food',
    'fashion-hub.com': 'fashion',
    'business-world.com': 'business',
    'education-portal.com': 'education',
    'entertainment-zone.com': 'entertainment',
    'global-news.com': 'news',
    'tech-trends.com': 'technology',
    'sports-daily.com': 'sports',
    'wellness-today.com': 'health',
    'world-traveler.com': 'travel',
    'gourmet-paradise.com': 'food',
    'style-hub.com': 'fashion',
    'finance-world.com': 'business',
    'learning-portal.com': 'education',
    'fun-zone.com': 'entertainment',
  };

  const adtechs = [
    'GoogleAds',
    'FacebookAds',
    'AmazonAds',
    'TradeDesk',
    'AdobeAdvertising',
    'MediaMath',
    'AppNexus',
    'Criteo',
    'PubMatic',
    'VerizonMedia',
    'Taboola',
    'Outbrain',
    'AdRoll',
    'Quantcast',
    'RocketFuel',
    'Sizmek',
    'Choozle',
    'Centro',
    'ZetaGlobal',
    'LiveRamp',
  ];

  app.assignAdtechsToSites = (sites, ad) => {
    const siteAdtechs = {};
    sites.forEach((site) => {
      const numAdtechs = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
      const assignedAdtechs = [];
      for (let i = 0; i < numAdtechs; i++) {
        const randomAdtech = ad[Math.floor(Math.random() * ad.length)];
        if (!assignedAdtechs.includes(randomAdtech)) {
          assignedAdtechs.push(randomAdtech);
        }
      }
      siteAdtechs[site] = assignedAdtechs;
    });
    return siteAdtechs;
  };

  app.getAdtechsColors = () => ({
    GoogleAds: p.color(255, 99, 71), // Tomato
    FacebookAds: p.color(135, 206, 250), // Light Sky Blue
    AmazonAds: p.color(255, 182, 193), // Light Pink
    TradeDesk: p.color(100, 149, 237), // Cornflower Blue
    AdobeAdvertising: p.color(144, 238, 144), // Light Green
    MediaMath: p.color(255, 160, 122), // Light Salmon
    AppNexus: p.color(255, 215, 0), // Gold
    Criteo: p.color(0, 255, 255), // Cyan
    PubMatic: p.color(255, 105, 180), // Hot Pink
    VerizonMedia: p.color(255, 165, 0), // Orange
    Taboola: p.color(0, 0, 255), // Blue
    Outbrain: p.color(0, 255, 0), // Lime
    AdRoll: p.color(255, 0, 0), // Red
    Quantcast: p.color(128, 0, 128), // Purple
    RocketFuel: p.color(0, 0, 0), // Black
    Sizmek: p.color(255, 140, 0), // Dark Orange
    Choozle: p.color(128, 128, 128), // Gray
    Centro: p.color(128, 0, 0), // Maroon
    ZetaGlobal: p.color(0, 128, 0), // Green
    LiveRamp: p.color(0, 128, 128), // Teal
  });

  app.handlePlayPauseButttons = () => {
    app.playButton = document.getElementById('play');
    app.pauseButton = document.getElementById('pause');

    app.playButton?.addEventListener('click', app.play);
    app.pauseButton?.addEventListener('click', app.pause);
  };

  app.play = () => {
    // app.playButton.classList.add('hidden');
    // app.pauseButton.classList.remove('hidden');
    app.isPaused = false;
    app.setupInterval();
  };

  app.pause = () => {
    // app.pauseButton.classList.add('hidden');
    // app.playButton.classList.remove('hidden');
    app.isPaused = true;
    clearInterval(app.internval);
  };

  app.getWebsiteToTopic = (website) => {
    return [websiteToTopicMapping[website]];
  };

  app.getIncrementalDateTime = (startDate, incrementMinutes) => {
    const date = new Date(startDate);
    date.setMinutes(date.getMinutes() + incrementMinutes);
    return date.toISOString().slice(0, 16).replace('T', ' ');
  };

  app.generateTimelineVisits = (
    sites,
    numVisitsPerEpoch,
    startDate = new Date()
  ) => {
    const visits = [];
    let currentDateTime = new Date(startDate);

    const incrementMinutes = (7 * 24 * 60) / numVisitsPerEpoch; // Total minutes in a week divided by visits per epoch

    for (let visit = 0; visit < numVisitsPerEpoch; visit++) {
      const website = sites[Math.floor(Math.random() * sites.length)];
      const datetime = app.getIncrementalDateTime(
        currentDateTime,
        incrementMinutes
      );
      const topics = app.getWebsiteToTopic(website);
      visits.push({ website, datetime, topics });
      currentDateTime = new Date(datetime); // Update currentDateTime for the next visit
    }

    return visits;
  };

  app.startNextEpoch = () => {
    setTimeout(() => {
      app.currentIndex = 0;

      p.clear();
      app.epochIndex++;
      app.weekCount++;
      const length = config.timeline.circles.length;
      const nextStartDate = new Date(
        config.timeline.circles[app.epochIndex - 1][length - 1].datetime
      );
      nextStartDate.setDate(nextStartDate.getDate() + 1);
      config.timeline.circles.push(
        app.generateTimelineVisits(websites, 6, nextStartDate)
      );

      if (config.timeline.circles.length > 3) {
        config.timeline.circles.shift();
        app.visitedTopics.push([]);
        app.visitedTopics.shift();
        app.topicsVisitCount.push([]);
        app.topicsVisitCount.shift();
        app.epochIndex = 2;
      }

      if (app.epochIndex >= 2) {
        app.moveEpochTimeline(app.epochIndex - 2, 500, app.weekCount - 2);
        app.drawTable(app.epochIndex - 2, app.weekCount - 2, {
          y: config.timeline.position.y + 600,
        });
      }
      app.moveEpochTimeline(app.epochIndex - 1, 250, app.weekCount - 1);
      app.drawTable(app.epochIndex - 1, app.weekCount - 1, {
        y: config.timeline.position.y + 300,
      });

      app.drawEpoch(app.epochIndex, app.weekCount);
      app.drawTable(app.epochIndex, app.weekCount);
    }, 1000);
  };

  app.setupInterval = () => {
    app.internval = setInterval(() => {
      if (!app.isPaused) {
        app.handleUserVisit(app.epochIndex, app.currentIndex);
        app.drawTable(app.epochIndex, app.weekCount);

        app.currentIndex++;
        if (
          app.currentIndex >= config.timeline.circles[app.epochIndex].length
        ) {
          clearInterval(app.internval);

          app.startNextEpoch();
        }
      }
    }, config.timeline.stepDelay);
  };

  app.drawTimelineKiLine = (position) => {
    const { diameter, verticalSpacing } = config.timeline.circleProps;
    const circleVerticalSpace = verticalSpacing + diameter;

    p.line(position.x, position.y, position.x, circleVerticalSpace * 8);
  };

  app.drawTimeline = (
    { position, circleProps, circles },
    epochIndex,
    weekCount
  ) => {
    const { diameter, verticalSpacing } = circleProps;
    const circleVerticalSpace = verticalSpacing - 30 + diameter;
    const leftPadding = position.x - 150;

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text('Epoch Week ' + weekCount, position.x, 25);

    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);

    // Draw circles and text at the timeline position
    circles.forEach((circleItem, index) => {
      const yPosition = verticalSpacing + circleVerticalSpace * index;

      app.circlePositions[epochIndex].push({ x: position.x, y: yPosition });
      app.drawCircle(epochIndex, index);

      p.text(circleItem.datetime, leftPadding, yPosition);
      p.text(circleItem.website, leftPadding, yPosition + 20);
      p.text(circleItem.topics.join(', '), leftPadding, yPosition + 40);

      // Draw line leading out of the circle
      p.line(position.x - 25, yPosition, position.x - 40, yPosition);
    });
  };

  app.drawCircle = (epoch, index) => {
    const position = app.circlePositions[epoch][index];
    const { diameter } = config.timeline.circleProps;

    p.circle(position.x, position.y, diameter);
  };

  app.drawSmallCircles = (epoch, index, currentSite) => {
    const position = app.circlePositions[epoch][index];
    const { diameter } = config.timeline.circleProps;
    const smallCircleDiameter = diameter / 5;

    const distanceFromEdge = 6;

    const adTechs = app.siteAdtechs[currentSite];
    const numSmallCircles = adTechs.length;

    const smallCirclePositions = [];

    for (let i = 0; i < numSmallCircles; i++) {
      let randomX, randomY, isOverlapping;

      do {
        const angle = Math.random() * 2 * Math.PI;

        randomX =
          position.x + (diameter / 2 + distanceFromEdge) * Math.cos(angle);
        randomY =
          position.y + (diameter / 2 + distanceFromEdge) * Math.sin(angle);

        // eslint-disable-next-line no-loop-func
        isOverlapping = smallCirclePositions.some((pos) => {
          const dx = pos.x - randomX;
          const dy = pos.y - randomY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < smallCircleDiameter;
        });
      } while (isOverlapping);

      smallCirclePositions.push({ x: randomX, y: randomY });

      const adTechColor = app.getAdtechsColors()[adTechs[i]];

      p.push();
      p.fill(adTechColor);
      p.circle(randomX, randomY, smallCircleDiameter);
      p.pop();
    }
  };

  app.renderUser = (epochIndex, visitIndex) => {
    if (epochIndex >= config.timeline.circles.length) {
      app.pause();
      return;
    }

    const circlePosition = app.circlePositions[epochIndex][visitIndex];

    if (circlePosition === undefined) {
      return;
    }

    const user = config.timeline.user;

    if (visitIndex > 0) {
      app.drawCircle(epochIndex, visitIndex - 1);
    }

    p.image(
      userIcon,
      circlePosition.x - user.width / 2,
      circlePosition.y - user.height / 2,
      user.width,
      user.height
    );

    const currentCircle = config.timeline.circles[epochIndex][visitIndex];
    const currentSite = currentCircle.website;

    app.drawSmallCircles(epochIndex, visitIndex, currentSite);
  };

  app.handleUserVisit = (epochIndex, visitIndex) => {
    app.renderUser(epochIndex, visitIndex);

    const currentCircle = config.timeline.circles[epochIndex][visitIndex];
    const currentSite = currentCircle.website;
    currentCircle.topics.forEach((topic) => {
      if (!app.visitedTopics[epochIndex][topic]) {
        app.visitedTopics[epochIndex][topic] = [];
      }

      app.visitedTopics[epochIndex][topic].push(
        ...app.siteAdtechs[currentSite]
      );
    });

    currentCircle.topics.forEach((topic) => {
      if (!app.topicsVisitCount[epochIndex]) {
        app.topicsVisitCount[epochIndex] = {};
      }

      if (!app.topicsVisitCount[epochIndex][topic]) {
        app.topicsVisitCount[epochIndex][topic] = 0;
      }

      app.topicsVisitCount[epochIndex][topic]++;
    });
  };

  app.calculateMaxSiteWidth = (epochIndex) => {
    const topicSites = app.visitedTopics[epochIndex];
    let maxWidth = 0;

    Object.values(topicSites).forEach((sites) => {
      const uniqueSites = [...new Set(sites)];
      const siteText = uniqueSites.join(', ');
      const textWidthValue = p.textWidth(siteText);
      if (textWidthValue > maxWidth) {
        maxWidth = textWidthValue;
      }
    });

    return maxWidth;
  };

  app.drawTable = (epochIndex, weekCount, position = undefined) => {
    const topics = Object.keys(app.visitedTopics[epochIndex]);
    const numRows = topics.length;
    const rowHeight = 30;
    const colWidth = 150;
    const tableOffsetX = position?.x || 800;
    const tableOffsetY = position?.y || 50;
    const maxSiteWidth = app.calculateMaxSiteWidth(epochIndex);

    p.push();
    p.textSize(16);
    p.text(
      'Epoch Week ' + weekCount + ' Summary',
      tableOffsetX,
      tableOffsetY - 30
    );

    p.fill(255);
    p.textSize(12);
    p.rect(
      tableOffsetX,
      tableOffsetY,
      Math.max(2 * colWidth + maxSiteWidth * 1.75, 400),
      numRows * rowHeight + 40
    );

    p.textSize(16);
    p.fill(0);

    p.text('Topic', tableOffsetX + 10, tableOffsetY + 20);
    p.text('Count', tableOffsetX + colWidth + 10, tableOffsetY + 20);
    p.text('Ad Techs', tableOffsetX + 2 * colWidth + 10, tableOffsetY + 20);
    p.line(
      tableOffsetX,
      tableOffsetY + 40,
      tableOffsetX + Math.max(2 * colWidth + maxSiteWidth * 1.75, 400),
      tableOffsetY + 40
    );

    topics
      .sort(
        (a, b) =>
          app.topicsVisitCount[epochIndex][b] -
          app.topicsVisitCount[epochIndex][a]
      )
      .forEach((topic, index) => {
        const y = (index + 1) * rowHeight + tableOffsetY + 30;
        p.fill(255);
        p.rect(tableOffsetX, y - 20, colWidth, rowHeight);

        p.fill(0);
        p.text(topic, tableOffsetX + 10, y);

        const topicCounts = app.topicsVisitCount[epochIndex];
        p.text(topicCounts[topic] || 0, tableOffsetX + colWidth + 10, y);

        const sortedAdTechs = [
          ...new Set(app.visitedTopics[epochIndex][topic].slice().sort()),
        ];
        // text(sortedAdTechs.join(', '), tableOffsetX + 2 * colWidth + 10, y);
        let widthTracker = 0;
        for (let i = 0; i < sortedAdTechs.length; i++) {
          const textWidthValue = p.textWidth(sortedAdTechs[i]);
          p.fill(app.getAdtechsColors()[sortedAdTechs[i]]);
          p.rect(
            tableOffsetX + 2 * colWidth + 5 + widthTracker,
            y - 15,
            textWidthValue + 10,
            25
          );
          p.fill(255);
          p.text(
            sortedAdTechs[i],
            tableOffsetX + 2 * colWidth + 10 + widthTracker,
            y
          );

          widthTracker += textWidthValue + 20;
        }

        p.line(
          tableOffsetX,
          y + 10,
          tableOffsetX + Math.max(2 * colWidth + maxSiteWidth * 1.75, 400),
          y + 10
        );
      });

    p.line(
      tableOffsetX + colWidth,
      tableOffsetY,
      tableOffsetX + colWidth,
      tableOffsetY + numRows * rowHeight + 40
    );

    p.line(
      tableOffsetX + 2 * colWidth,
      tableOffsetY,
      tableOffsetX + 2 * colWidth,
      tableOffsetY + numRows * rowHeight + 40
    );

    p.pop();
  };

  app.moveEpochTimeline = (epochIndex, moveBy, weekCount) => {
    const epoch = config.timeline.circles[epochIndex];
    const position = {
      x: config.timeline.position.x + moveBy,
      y: config.timeline.position.y,
    };
    app.circlePositions[epochIndex + 1] = [];
    app.circlePositions[epochIndex] = [];

    app.drawTimelineKiLine(position);
    app.drawTimeline(
      {
        position,
        circleProps: config.timeline.circleProps,
        circles: epoch,
      },
      epochIndex,
      weekCount
    );

    let visitIndex = 0;
    while (visitIndex < epoch.length) {
      app.renderUser(epochIndex, visitIndex);
      visitIndex++;
    }
  };

  app.drawEpoch = (epochIndex, weekCount) => {
    const epoch = config.timeline.circles[epochIndex];

    app.circlePositions[epochIndex] = [];
    app.drawTimelineKiLine(config.timeline.position);
    app.drawTimeline(
      {
        position: config.timeline.position,
        circleProps: config.timeline.circleProps,
        circles: epoch,
      },
      epochIndex,
      weekCount
    );
    app.handlePlayPauseButttons();
    app.play();
  };

  p.preload = () => {
    userIcon = p.loadImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg=='
    );
  };

  p.setup = () => {
    config.timeline.circles = [app.generateTimelineVisits(websites, 6)];

    app.siteAdtechs = app.assignAdtechsToSites(websites, adtechs);
    const circleVerticalSpace =
      config.timeline.circleProps.verticalSpacing +
      config.timeline.circleProps.diameter;
    p.createCanvas(config.canvas.width, circleVerticalSpace * 8);
    p.background(245);

    app.drawEpoch(app.epochIndex, app.weekCount);
  };
}
