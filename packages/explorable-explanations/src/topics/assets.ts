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
 * Internal dependencies
 */
import icons from '../icons.json';
import { websitesToIconsMapping } from './data';

const assets = {
  userIcon: icons.user,
  completedIcon: icons.completedCheckMark,
  'tmz.com': websitesToIconsMapping['tmz.com'],
  'cnet.com': websitesToIconsMapping['cnet.com'],
  'espn.com': websitesToIconsMapping['espn.com'],
  'investopedia.com': websitesToIconsMapping['investopedia.com'],
  'tripadvisor.com': websitesToIconsMapping['tripadvisor.com'],
  'allrecipes.com': websitesToIconsMapping['allrecipes.com'],
  'vogue.com': websitesToIconsMapping['vogue.com'],
  'bloomberg.com': websitesToIconsMapping['bloomberg.com'],
  'linkedin.com': websitesToIconsMapping['linkedin.com'],
  'rollingstone.com': websitesToIconsMapping['rollingstone.com'],
  'cnn.com': websitesToIconsMapping['cnn.com'],
  'techcrunch.com': websitesToIconsMapping['techcrunch.com'],
  'cbssports.com': websitesToIconsMapping['cbssports.com'],
  'healthline.com': websitesToIconsMapping['healthline.com'],
  'expedia.com': websitesToIconsMapping['expedia.com'],
  'foodnetwork.com': websitesToIconsMapping['foodnetwork.com'],
  'cosmopolitan.com': websitesToIconsMapping['cosmopolitan.com'],
  'nerdwallet.com': websitesToIconsMapping['nerdwallet.com'],
  'indeed.com': websitesToIconsMapping['indeed.com'],
  'crunchyroll.com': websitesToIconsMapping['crunchyroll.com'],
};

export default assets;
