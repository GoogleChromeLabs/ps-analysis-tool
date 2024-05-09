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
/**
 * Internal dependencies.
 */
import {
  GSIAccordion,
  getGSIV2Matches,
  GSI_V2_SIGNATURE_STRONG_MATCHES,
  GSI_V2_SIGNATURE_WEAK_MATCHES,
  GSI_HELP_URL,
  GSI_V2_DOMAINS_TO_SKIP,
} from './libraries/gsi';
import {
  GISAccordion,
  getGISMatches,
  GIS_SIGNATURE_WEAK_MATCHES,
  GIS_HELP_URL,
  GIS_DOMAINS_TO_SKIP,
} from './libraries/gis';
import {
  FBCommentsAccordion,
  FB_COMMENTS_HELP_URL,
  fbCommentsDOMQuery,
} from './libraries/fb-comments';
import {
  FBLikesAccordion,
  fbLikesDOMQuery,
  FB_LIKES_HELP_URL,
} from './libraries/fb-likes';
import {
  DisqusCommentsAccordion,
  disqusCommentsDOMQuery,
  DISQUS_COMMENTS_HELP_URL,
} from './libraries/disqus-comments';
import {
  JetpackCommentsAccordion,
  jetpackCommentsDOMQuery,
  JETPACK_COMMENTS_HELP_URL,
} from './libraries/jetpack-comments';
import {
  JetpackLikesAccordion,
  jetpackLikesDOMQuery,
  JETPACK_LIKES_HELP_URL,
} from './libraries/jetpack-likes';

const LIBRARIES = [
  {
    name: 'gsiV2',
    component: GSIAccordion,
    signatures: {
      strongMatches: GSI_V2_SIGNATURE_STRONG_MATCHES,
      weakMatches: GSI_V2_SIGNATURE_WEAK_MATCHES,
    },
    domainsToSkip: GSI_V2_DOMAINS_TO_SKIP,
    helpUrl: GSI_HELP_URL,
    detectionFunction: getGSIV2Matches,
  },
  {
    name: 'gis',
    component: GISAccordion,
    signatures: {
      strongMatches: [],
      weakMatches: GIS_SIGNATURE_WEAK_MATCHES,
    },
    domainsToSkip: GIS_DOMAINS_TO_SKIP,
    helpUrl: GIS_HELP_URL,
    detectionFunction: getGISMatches,
  },
  {
    name: 'fb-comments',
    component: FBCommentsAccordion,
    helpUrl: FB_COMMENTS_HELP_URL,
    domQueryFunction: fbCommentsDOMQuery,
  },
  {
    name: 'fb-likes',
    component: FBLikesAccordion,
    helpUrl: FB_LIKES_HELP_URL,
    domQueryFunction: fbLikesDOMQuery,
  },
  {
    name: 'disqus-comments',
    component: DisqusCommentsAccordion,
    helpUrl: DISQUS_COMMENTS_HELP_URL,
    domQueryFunction: disqusCommentsDOMQuery,
  },
  {
    name: 'jetpack-comments',
    component: JetpackCommentsAccordion,
    helpUrl: JETPACK_COMMENTS_HELP_URL,
    domQueryFunction: jetpackCommentsDOMQuery,
  },
  {
    name: 'jetpack-likes',
    component: JetpackLikesAccordion,
    helpUrl: JETPACK_LIKES_HELP_URL,
    domQueryFunction: jetpackLikesDOMQuery,
  },
];

export default LIBRARIES;
