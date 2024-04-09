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
 * External dependencies.
 */
import { addUTMParams } from '@ps-analysis-tool/common';

export const QUICK_LINKS = [
  {
    title: 'dsLearnMore',
    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki',
  },
  {
    title: 'dsJoinDiscussion',
    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions',
  },
  {
    title: 'dsReportBug',
    link: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=',
  },
  {
    title: 'dsReportBreakage',
    link: 'https://goo.gle/report-3pc-broken',
  },
  {
    title: 'dsRequestMigrationTime',
    link: addUTMParams(
      'https://developer.chrome.com/origintrials/#/view_trial/3315212275698106369'
    ),
  },
];
