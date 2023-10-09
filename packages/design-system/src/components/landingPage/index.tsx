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
import React, { ReactNode, useEffect, useState } from 'react';
import classNames from 'classnames';
import { XMLParser } from 'fast-xml-parser';

/**
 * Internal dependencies.
 */
import { ArrowUp, ChevronRight } from '../../icons';
import ProgressBar from '../progressBar';
import BulletList from '../bulletList';
import { QUICK_LINKS } from './constants';

interface LandingPageProps {
  title?: string;
  children?: ReactNode;
  isLoading?: boolean;
}

const LandingPage = ({ title, children, isLoading }: LandingPageProps) => {
  const [open, setOpen] = useState(false);
  const [news, setNews] = useState<BulletListItem[]>([]);

  const fetchLatestNews = async () => {
    try {
      const response = await fetch('https://privacysandbox.com/rss/');
      const xmlResponse = await response.text();

      const parser = new XMLParser();
      const parsedFeed = parser.parse(xmlResponse);

      const items = parsedFeed?.rss?.channel?.item;

      if (items) {
        const newsArray = items.map((item: BulletListItem) => ({
          title: item.title,
          link: item.link,
        }));

        setNews(newsArray);
      }
    } catch (error) {
      // Currently logging, but ideally inform user through UI.
      console.warn('Error fetching latest news', error);
    }
  };

  useEffect(() => {
    fetchLatestNews();
  }, []);

  return (
    <>
      {isLoading && <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />}
      <div className={classNames(isLoading && 'hidden')}>
        <div className="px-4 pt-6 pb-3 border-b border-hex-gray dark:border-quartz">
          <button
            className="flex gap-2 text-2xl font-bold items-baseline dark:text-bright-gray"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            {title && <h1 className="text-left">{title}</h1>}
            <ArrowUp
              className={classNames(!open && 'rotate-180 -translate-y-1')}
            />
          </button>
        </div>

        {/* Section Content */}
        <div
          className={classNames(
            !open && 'hidden',
            'border-b border-hex-gray dark:border-quartz'
          )}
        >
          {children}
        </div>

        <div className="md:max-w-[70%] flex flex-col md:flex-row px-4 pt-12 pb-24 gap-10">
          {/* Quick Links */}
          <div className="md:w-[35%] flex flex-col gap-4">
            <BulletList rows={QUICK_LINKS} heading="Quick Links" />
          </div>

          {/* Latest News */}
          <div className="md:w-[65%] flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase text-darkest-gray dark:text-bright-gray">
              Latest News
            </h2>
            <hr className="border-0 border-b border-hex-gray dark:border-quartz" />
            <div className="space-y-4">
              <BulletList rows={news} />

              <div className="ml-6">
                <a
                  href="https://privacysandbox.com/news/"
                  target="_blank"
                  rel="noreferrer"
                  className="leading-6 text-sm text-analytics dark:text-medium-persian-blue font-semibold px-3 border border-american-silver dark:border-quartz rounded inline-flex gap-2 items-center"
                >
                  View More <ChevronRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
