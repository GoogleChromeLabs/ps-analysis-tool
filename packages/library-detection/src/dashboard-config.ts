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
import { GSIAccordionContent } from './libraries/gsi';
import { GISAccordionContent } from './libraries/gis';
import { FBCommentsAccordionContent } from './libraries/fb-comments';
import { FBLikesAccordionContent } from './libraries/fb-likes';
import { DisqusCommentsAccordionContent } from './libraries/disqus-comments';
import { JetpackCommentsAccordionContent } from './libraries/jetpack-comments';
import { JetpackLikesAccordionContent } from './libraries/jetpack-likes';
import type { AccordionContentComponent } from './types';

export const KNOWN_BREAKAGES: {
  [key: string]: AccordionContentComponent;
} = {
  'Deprecated Google Sign-In': GSIAccordionContent,
  'Unsupported Google Identity Services': GISAccordionContent,
  'Facebook Comments': FBCommentsAccordionContent,
  'Facebook Like Button': FBLikesAccordionContent,
  'Disqus Comments': DisqusCommentsAccordionContent,
  'Jetpack Comments': JetpackCommentsAccordionContent,
  'Jetpack Like Button': JetpackLikesAccordionContent,
};
