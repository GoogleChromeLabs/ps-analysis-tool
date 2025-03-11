/*
 * Copyright 2025 Google LLC
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
 * External dependencies
 */
import p5 from 'p5';

/**
 * Internal dependencies
 */
import icons from '../icons.json';
import { websitesToIconsMapping } from './data';

const preload = (p: p5) => () => {
  const assets = {
    user: p.loadImage(icons.user),
    completedCheckMark: p.loadImage(icons.completedCheckMark),
    'tmz.com': p.loadImage(websitesToIconsMapping['tmz.com']),
    'cnet.com': p.loadImage(websitesToIconsMapping['cnet.com']),
    'espn.com': p.loadImage(websitesToIconsMapping['espn.com']),
    'investopedia.com': p.loadImage(websitesToIconsMapping['investopedia.com']),
    'tripadvisor.com': p.loadImage(websitesToIconsMapping['tripadvisor.com']),
    'allrecipes.com': p.loadImage(websitesToIconsMapping['allrecipes.com']),
    'vogue.com': p.loadImage(websitesToIconsMapping['vogue.com']),
    'bloomberg.com': p.loadImage(websitesToIconsMapping['bloomberg.com']),
    'linkedin.com': p.loadImage(websitesToIconsMapping['linkedin.com']),
    'rollingstone.com': p.loadImage(websitesToIconsMapping['rollingstone.com']),
    'cnn.com': p.loadImage(websitesToIconsMapping['cnn.com']),
    'techcrunch.com': p.loadImage(websitesToIconsMapping['techcrunch.com']),
    'cbssports.com': p.loadImage(websitesToIconsMapping['cbssports.com']),
    'healthline.com': p.loadImage(websitesToIconsMapping['healthline.com']),
    'expedia.com': p.loadImage(websitesToIconsMapping['expedia.com']),
    'foodnetwork.com': p.loadImage(websitesToIconsMapping['foodnetwork.com']),
    'cosmopolitan.com': p.loadImage(websitesToIconsMapping['cosmopolitan.com']),
    'nerdwallet.com': p.loadImage(websitesToIconsMapping['nerdwallet.com']),
    'indeed.com': p.loadImage(websitesToIconsMapping['indeed.com']),
    'crunchyroll.com': p.loadImage(websitesToIconsMapping['crunchyroll.com']),
  };

  return assets;
};

export default preload;
