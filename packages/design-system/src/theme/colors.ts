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
    className: 'text-emerald',
  },
  marketing: {
    color: '#F3AE4E',
    className: 'text-max-yellow-red',
  },
  analytics: {
    color: '#4C79F4',
    className: 'text-blue-berry',
  },
  uncategorized: {
    color: '#EC7159',
    className: 'text-blue-berry',
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
  None: {
    color: '#465362',
    className: 'text-color-charcoal',
  },
  UserSetting: {
    color: '#F9DC5C',
    className: 'text-napels-yellow',
  },

  TPCDMetadata: {
    color: '#ED254E',
    className: 'text-red-corolla',
  },

  TPCDDeprecationTrial: {
    color: '#08A4BD',
    className: 'text-moonstone',
  },

  TPCDHeuristics: {
    color: '#446DF6',
    className: 'text-noon-blue',
  },

  EnterprisePolicy: {
    color: '#4C212A',
    className: 'text-chocolate-cosmos',
  },

  StorageAccess: {
    color: '#D96C06',
    className: 'text-cocoa-brown',
  },

  TopLevelStorageAccess: {
    color: '#3A1772',
    className: 'text-persian-indigo',
  },

  CorsOptIn: {
    color: '#D741A7',
    className: 'text-hollywood-cerise',
  },
  SyntaxError: {
    color: '#FF6F91',
    className: 'text-baby-pink-gradient',
  },
  SchemeNotSupported: {
    color: '#B39CD0',
    className: 'text-spot-palette-mud-pink',
  },
  OverwriteSecure: {
    color: '#E59500',
    className: 'text-jamboo',
  },
  InvalidPrefix: {
    color: '#EB4B98',
    className: 'text-rose-bourbon',
  },
  SamePartyConflictsWithOtherAttributes: {
    color: '#E0A890',
    className: 'text-orange-buff',
  },
  DisallowedCharacter: {
    color: '#0FFF95',
    className: 'text-spring-green',
  },
  NoCookieContent: {
    color: '#840032',
    className: 'text-maroon-claret',
  },
  gsiV2: {
    color: '#25ACAD',
    className: 'text-greenland-green',
  },
  gis: {
    color: '#C5A06A',
    className: 'text-good-life',
  },
  'fb-comments': {
    color: '#AF7AA3',
    className: 'text-victorian-violet',
  },
  'fb-likes': {
    color: '#F54021',
    className: 'text-strawberry-spinach-red',
  },
  'disqus-comments': {
    color: '#A98307',
    className: 'text-chestnut-gold',
  },
  'jetpack-comments': {
    color: '#7D8471',
    className: 'text-battle-dress',
  },
  'jetpack-likes': {
    color: '#C5A06A',
    className: 'text-good-life',
  },
};
