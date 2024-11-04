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

const websiteToTopicMapping: Record<string, string> = {
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

export { websites, websiteToTopicMapping, adtechs };
