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
import { BidderType } from '@google-psat/common';

export const INITIAL_TIME = 50;
export const TIME_DURATION = 50;
export const BAR_HEIGHT = 50;

export const BAR_COLORS: Record<BidderType, string> = {
  [BidderType.BID]: '#7CACF8',
  [BidderType.NO_BID]: '#EC7159',
  [BidderType.WON]: '#5CC971',
  [BidderType.TIMED_OUT]: '#FC2D04',
};
