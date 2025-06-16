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
import { websites, websiteToTopicMapping } from './data';

export const assignAdtechsToSites = (sites: string[], adTechs: string[]) => {
  const siteAdtechs: Record<string, string[]> = {};

  sites.forEach((site) => {
    const numAdtechs = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
    const assignedAdtechs: string[] = [];
    for (let i = 0; i < numAdtechs; i++) {
      const randomAdtech = adTechs[Math.floor(Math.random() * adTechs.length)];
      if (!assignedAdtechs.includes(randomAdtech)) {
        assignedAdtechs.push(randomAdtech);
      }
    }
    siteAdtechs[site] = assignedAdtechs;
  });

  return siteAdtechs;
};

export const ADTECH_COLORS = {
  GoogleAds: '#FF6347', // Tomato
  FacebookAds: '#87CEFA', // Light Sky Blue
  AmazonAds: '#FFB6C1', // Light Pink
  TradeDesk: '#6495ED', // Cornflower Blue
  AdobeAdvertising: '#90EE90', // Light Green
  MediaMath: '#FFA07A', // Light Salmon
  AppNexus: '#FFD700', // Gold
  Criteo: '#00FFFF', // Cyan
  PubMatic: '#FF69B4', // Hot Pink
  VerizonMedia: '#FFA500', // Orange
  Taboola: '#0000FF', // Blue
  Outbrain: '#00FF00', // Lime
  AdRoll: '#FF0000', // Red
  Quantcast: '#800080', // Purple
  RocketFuel: '#000000', // Black
  Sizmek: '#FF8C00', // Dark Orange
  Choozle: '#808080', // Gray
  Centro: '#800000', // Maroon
  ZetaGlobal: '#008000', // Green
  LiveRamp: '#008080', // Teal
};

export const getWebsiteToTopic = (website: string) => {
  return websiteToTopicMapping[website];
};

export const getIncrementalDateTime = (
  startDate: Date,
  incrementMinutes: number
) => {
  const date = new Date(startDate);
  date.setMinutes(date.getMinutes() + incrementMinutes);
  return date.toISOString().slice(0, 16).replace('T', ' ');
};

export const generateTimelineVisits = (
  numVisitsPerEpoch: number,
  startDate = new Date()
) => {
  const visits: { website: string; datetime: string; topics: string[] }[] = [];
  let currentDateTime = new Date(startDate);

  const incrementMinutes = (7 * 24 * 60) / numVisitsPerEpoch; // Total minutes in a week divided by visits per epoch

  for (let visit = 0; visit < numVisitsPerEpoch; visit++) {
    let website = websites[Math.floor(Math.random() * websites.length)];
    let isDuplicate = visits.find((v) => v.website === website);

    while (isDuplicate) {
      website = websites[Math.floor(Math.random() * websites.length)];
      // eslint-disable-next-line no-loop-func
      isDuplicate = visits.find((v) => v.website === website);
    }

    const datetime = getIncrementalDateTime(currentDateTime, incrementMinutes);
    const topics = getWebsiteToTopic(website);
    visits.push({ website, datetime, topics });
    currentDateTime = new Date(datetime); // Update currentDateTime for the next visit
  }

  return visits;
};

export const createEpochs = () => {
  const epochs: {
    webVisits: { website: string; datetime: string; topics: string[] }[];
  }[] = [];

  const numEpochs = 4;
  const numVisitsPerEpoch = 6;
  const startDate = new Date();

  for (let epoch = 0; epoch < numEpochs; epoch++) {
    const webVisits = generateTimelineVisits(numVisitsPerEpoch, startDate);
    epochs.push({ webVisits });
    startDate.setHours(startDate.getHours() + 24 * 7); // Add a week to the start
  }

  return epochs;
};

/**
 * Generates random positions for small circles based on the position of the main circle
 * @param totalSmallCircles - Total number of small circles
 * @param position - Position of the circle
 * @param position.x - X coordinate of the circle
 * @param position.y - Y coordinate of the circle
 * @param diameter - Diameter of the circle
 * @param smallCircleDiameter - Diameter of the small circles
 * @returns Array of small circle positions
 */
export const getSmallCirclePositions = (
  totalSmallCircles: number,
  position: { x: number; y: number },
  diameter: number,
  smallCircleDiameter: number
) => {
  const smallCirclePositions: { x: number; y: number }[] = [];
  const distanceFromEdge = 6;

  for (let i = 0; i < totalSmallCircles; i++) {
    let randomX: number, randomY: number, isOverlapping: boolean;

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

      const circleCircleDistanceX = Math.abs(position.x - randomX);
      const circleCircleDistanceY = Math.abs(position.y - randomY);

      isOverlapping =
        isOverlapping ||
        circleCircleDistanceX <= smallCircleDiameter ||
        circleCircleDistanceY <= smallCircleDiameter;
    } while (isOverlapping);

    smallCirclePositions.push({ x: randomX, y: randomY });
  }

  return smallCirclePositions;
};
