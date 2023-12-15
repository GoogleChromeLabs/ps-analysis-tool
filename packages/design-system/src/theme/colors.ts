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
export const COLOR_MAP: {
  [key: string]: { color: string; className: string };
} = {
  functional: {
    color: '#5CC971',
    className: 'text-functional',
  },
  marketing: {
    color: '#F3AE4E',
    className: 'text-marketing',
  },
  analytics: {
    color: '#4C79F4',
    className: 'text-analytics',
  },
  uncategorized: {
    color: '#EC7159',
    className: 'text-uncategorised',
  },
  brightGray: {
    color: '#E8EAED',
    className: 'text-bright-gray',
  },
  mediumGray: {
    color: '#BDBDBD',
    className: 'text-medium-gray',
  },
  SecureOnly: {
    color: '#A98307',
    className: 'text-chestnut-gold',
  },
  DomainMismatch: {
    color: '#7D8471',
    className: 'text-battle-dress',
  },
  NotOnPath: {
    color: '#79553D',
    className: 'text-brownstone',
  },
  SameSiteStrict: {
    color: '#AF2B1E',
    className: 'text-upsed-tomato',
  },
  SameSiteLax: {
    color: '#FFA420',
    className: 'text-honey-wax',
  },
  SameSiteUnspecifiedTreatedAsLax: {
    color: '#FF7514',
    className: 'text-sparks-in-green',
  },
  SameSiteNoneInsecure: {
    color: '#924E7D',
    className: 'text-verve-violet',
  },
  UserPreferences: {
    color: '#E63244',
    className: 'text-red-radish',
  },
  ThirdPartyPhaseout: {
    color: '#999950',
    className: 'text-ancient-maze',
  },
  ThirdPartyBlockedInFirstPartySet: {
    color: '#DE4C8A',
    className: 'text-fandango-pink',
  },
  UnknownError: {
    color: '#DE4C8A',
    className: 'text-grilled-cheese',
  },
  SchemefulSameSiteStrict: {
    color: '#763C28',
    className: 'text-burnished-russet',
  },
  SchemefulSameSiteLax: {
    color: '#C6A664',
    className: 'text-spring-roll',
  },
  SchemefulSameSiteUnspecifiedTreatedAsLax: {
    color: '#E7EBDA',
    className: 'text-really-rain',
  },
  SamePartyFromCrossPartyContext: {
    color: '#008F39',
    className: 'text-pixelated-grass',
  },
  NameValuePairExceedsMaxSize: {
    color: '#1C542D',
    className: 'text-pixelated-dark-green',
  },
  ExcludeSameSiteUnspecifiedTreatedAsLax: {
    color: '#1C542D',
    className: 'text-jay-bird',
  },
  ExcludeSameSiteNoneInsecure: {
    color: '#EDFF21',
    className: 'text-john-lemon',
  },
  ExcludeSameSiteLax: {
    color: '#A5A5A5',
    className: 'text-rainy-grey',
  },
  ExcludeSameSiteStrict: {
    color: '#256D7B',
    className: 'text-discovery-bay',
  },
  ExcludeInvalidSameParty: {
    color: '#898176',
    className: 'text-crust',
  },
  ExcludeSamePartyCrossPartyContext: {
    color: '#497E76',
    className: 'text-azurite-water-green',
  },
  ExcludeDomainNonASCII: {
    color: '#7FB5B5',
    className: 'text-kingfisher-turquoise',
  },
  ExcludeThirdPartyCookieBlockedInFirstPartySet: {
    color: '#EFA94A',
    className: 'text-egyptian-gold',
  },
  ExcludeThirdPartyPhaseout: {
    color: '#CF3476',
    className: 'text-magentarama',
  },
  InvalidDomain: {
    color: '#D5CABD',
    className: 'text-hotrod-brown',
  },
};
