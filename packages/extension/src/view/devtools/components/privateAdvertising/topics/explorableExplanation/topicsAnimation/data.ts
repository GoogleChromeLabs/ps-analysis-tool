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

const websiteToTopicMapping: Record<string, string[]> = {
  'example-news.com': [
    '/News',
    '/Arts & Entertainment',
    '/Arts & Entertainment/Celebrities & Entertainment News',
  ],
  'tech-insights.com': [
    '/Computers & Electronics',
    '/Computers & Electronics/Consumer Electronics',
  ],
  'daily-sports.com': ['/Sports'],
  'health-today.com': [
    '/Finance',
    '/Finance/Insurance',
    '/Finance/Insurance/Health Insurance',
  ],
  'travel-guide.com': ['/Travel & Transportation'],
  'foodie-heaven.com': ['/Food & Drink'],
  'fashion-hub.com': ['/Beauty & Fitness', '/Beauty & Fitness/Fashion & Style'],
  'business-world.com': ['/Business & Industrial'],
  'education-portal.com': ['/Jobs & Education', '/Jobs & Education/Education'],
  'entertainment-zone.com': ['/Arts & Entertainment'],
  'global-news.com': ['/News', '/News/World News'],
  'tech-trends.com': [
    '/Computers & Electronics',
    '/Computers & Electronics/Software',
  ],
  'sports-daily.com': ['/Sports'],
  'wellness-today.com': [
    '/Jobs & Education',
    '/Jobs & Education/Education',
    '/Jobs & Education/Education/Health Education & Medical Training',
  ],
  'world-traveler.com': [
    '/Travel & Transportation',
    '/Travel & Transportation/Travel Agencies & Services',
  ],
  'gourmet-paradise.com': [
    '/Food & Drink',
    '/Food & Drink/Food',
    '/Food & Drink/Food/Gourmet & Specialty Foods',
  ],
  'style-hub.com': ['/Beauty & Fitness', '/Beauty & Fitness/Fashion & Style'],
  'finance-world.com': ['/Finance'],
  'learning-portal.com': ['/Jobs & Education'],
  'fun-zone.com': [
    '/Arts & Entertainment',
    '/Arts & Entertainment/Comics & Animation',
  ],
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
