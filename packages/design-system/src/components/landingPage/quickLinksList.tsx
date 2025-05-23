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
import React, { useEffect, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { addUTMParams } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import BulletList from '../bulletList';
import { QUICK_LINKS } from './constants';
import { ChevronRight } from '../../icons';
import Link from '../link';

const QuickLinksList = () => {
  const [news, setNews] = useState<BulletListItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('https://privacysandbox.com/rss/');
        const xmlResponse = await response.text();

        const parser = new XMLParser();
        const parsedFeed = parser.parse(xmlResponse);

        const items = parsedFeed?.rss?.channel?.item;

        if (items) {
          const newsArray = items
            .map((item: BulletListItem) => ({
              title: item.title,
              link: addUTMParams(item.link as string),
              date: item.pubDate ? new Date(item.pubDate).toISOString() : '',
            })) // @ts-ignore
            .sort((a, b) => b.date.localeCompare(a.date));

          setNews(newsArray);
        }
      } catch (error) {
        // Fail silently.
      }
    })();
  }, []);

  const quickLinks = QUICK_LINKS.map((link) => ({
    ...link,
    title: I18n.getMessage(link.title),
  }));

  return (
    <div className="flex flex-col md:flex-row px-4 pt-6 pb-24 gap-10">
      <div className="md:w-[35%] flex flex-col gap-4">
        <BulletList rows={quickLinks} heading={I18n.getMessage('quickLinks')} />
      </div>
      <div className="md:w-[65%] flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase text-darkest-gray dark:text-bright-gray">
          {I18n.getMessage('latestNews')}
        </h2>
        <hr className="border-0 border-b border-hex-gray dark:border-quartz" />
        <div className="space-y-4">
          <BulletList rows={news} />

          <div className="ml-6">
            <Link
              href={addUTMParams('https://privacysandbox.com/news/')}
              className="leading-6 text-sm text-bright-navy-blue dark:text-jordy-blue font-semibold px-3 border border-american-silver dark:border-quartz rounded inline-flex gap-2 items-center"
            >
              <>
                {I18n.getMessage('viewMore')}
                <ChevronRight className="text-bright-navy-blue dark:text-jordy-blue" />
              </>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinksList;
