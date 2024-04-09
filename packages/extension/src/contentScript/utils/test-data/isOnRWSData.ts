/*
 * Copyright 2023 Google LLC
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

const rws = {
  sets: [
    {
      contact: 'dmarti@raptive.com',
      primary: 'https://cafemedia.com',
      associatedSites: [
        'https://cardsayings.net',
        'https://nourishingpursuits.com',
      ],
      rationaleBySite: {
        'https://cardsayings.net': 'Co-branded content site',
        'https://nourishingpursuits.com': 'Co-branded content site',
      },
    },
    {
      primary: 'https://bild.de',
      contact: 'robert.blanck@axelspringer.com',
      associatedSites: [
        'https://welt.de',
        'https://autobild.de',
        'https://computerbild.de',
        'https://wieistmeineip.de',
      ],
      serviceSites: ['https://www.asadcdn.com'],
      rationaleBySite: {
        'https://welt.de': 'News Website welt.de',
        'https://autobild.de': 'Special Interest Website Autobild',
        'https://computerbild.de': 'Special Interest Website Computerbild',
        'https://wieistmeineip.de':
          'Internet speed Measurement Website of Computerbild',
        'https://www.asadcdn.com': 'CDN for Ad Files - Frequency Capping',
      },
    },
    {
      primary: 'https://hapara.com',
      contact: 'support@hapara.com',
      associatedSites: [
        'https://teacherdashboard.com',
        'https://mystudentdashboard.com',
      ],
      rationaleBySite: {
        'https://teacherdashboard.com': 'Portal for Hapara teachers',
        'https://mystudentdashboard.com': 'Portal for Hapara students',
      },
    },
    {
      contact: 'support@songstats.com',
      primary: 'https://songstats.com',
      associatedSites: ['https://songshare.com'],
      rationaleBySite: {
        'https://songshare.com': 'Specialized Platform for Music Smart Links',
      },
    },
    {
      contact: 'prashant.tiwari@htdigital.in',
      primary: 'https://hindustantimes.com',
      associatedSites: ['https://livemint.com'],
      rationaleBySite: {
        'https://livemint.com': 'Specialized Platform for economics',
      },
    },
    {
      contact: 'alexey@landyrev.com',
      primary: 'https://landyrev.com',
      associatedSites: ['https://landyrev.ru'],
      rationaleBySite: {
        'https://landyrev.ru': "Same publisher's website in a different region",
      },
    },
  ],
};

export default rws;
