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

import type p5 from 'p5';
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

export const getAdtechsColors = (p5: p5) => ({
  GoogleAds: p5.color(255, 99, 71), // Tomato
  FacebookAds: p5.color(135, 206, 250), // Light Sky Blue
  AmazonAds: p5.color(255, 182, 193), // Light Pink
  TradeDesk: p5.color(100, 149, 237), // Cornflower Blue
  AdobeAdvertising: p5.color(144, 238, 144), // Light Green
  MediaMath: p5.color(255, 160, 122), // Light Salmon
  AppNexus: p5.color(255, 215, 0), // Gold
  Criteo: p5.color(0, 255, 255), // Cyan
  PubMatic: p5.color(255, 105, 180), // Hot Pink
  VerizonMedia: p5.color(255, 165, 0), // Orange
  Taboola: p5.color(0, 0, 255), // Blue
  Outbrain: p5.color(0, 255, 0), // Lime
  AdRoll: p5.color(255, 0, 0), // Red
  Quantcast: p5.color(128, 0, 128), // Purple
  RocketFuel: p5.color(0, 0, 0), // Black
  Sizmek: p5.color(255, 140, 0), // Dark Orange
  Choozle: p5.color(128, 128, 128), // Gray
  Centro: p5.color(128, 0, 0), // Maroon
  ZetaGlobal: p5.color(0, 128, 0), // Green
  LiveRamp: p5.color(0, 128, 128), // Teal
});

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
  const visits = [];
  let currentDateTime = new Date(startDate);

  const incrementMinutes = (7 * 24 * 60) / numVisitsPerEpoch; // Total minutes in a week divided by visits per epoch

  for (let visit = 0; visit < numVisitsPerEpoch; visit++) {
    const website = websites[Math.floor(Math.random() * websites.length)];
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
