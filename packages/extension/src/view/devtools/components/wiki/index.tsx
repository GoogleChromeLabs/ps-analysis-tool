/*
 * Copyright 2024 Google LLC
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
import React, { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Internal dependencies.
 */
import Sidebar, { type SidebarMenuItem } from './sidebar';
import parseMenuMarkDown from '../../../../utils/parseMenuMarkDown';
import convertMarkdownToHTML from '../../../../utils/convertMarkdownToHTML';
import extractWikiPage from '../../../../utils/extractWikiPage';
import { INTERNAL_LINK } from './link';
import convertTitleToHash from '../../../../utils/convertTitleToHash';

const GITHUB_URL =
  'https://raw.githubusercontent.com/wiki/GoogleChromeLabs/ps-analysis-tool';
const loadedContent: {
  [key: string]: string;
} = {};

const Wiki = () => {
  const [pageContent, setPageContent] = useState<string>('');
  const [menuItems, setMenuItems] = useState<SidebarMenuItem[] | undefined>();
  const [currentSelectedPage, setCurrentSelectedPage] = useState('Home');
  const [currentHash, setCurrentHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const contentContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const menuResponse = await fetch(GITHUB_URL + '/_Sidebar.md');
      const menuMarkdown = await menuResponse.text();
      const _menuItems = parseMenuMarkDown(menuMarkdown, [
        'Contributor Guide',
        'Code of Conduct',
        'Support Forum',
      ]);

      setMenuItems(_menuItems);
      setIsLoading(false);
    })();
  }, []);

  const scrollToHashElement = useCallback(() => {
    if (!contentContainer.current) {
      return;
    }

    const headingElement = Array.from(
      contentContainer.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).find((el) => {
      return convertTitleToHash(el.textContent ?? '') === currentHash;
    });

    if (headingElement) {
      headingElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentHash]);

  useEffect(() => {
    (async () => {
      if (!loadedContent[currentSelectedPage]) {
        setIsLoading(true);
        const fileName = currentSelectedPage.replaceAll(' ', '-') + '.md';
        const response = await fetch(GITHUB_URL + '/' + fileName);

        const markdown = await response.text();
        const html = await convertMarkdownToHTML(markdown);

        loadedContent[currentSelectedPage] = html;

        setPageContent(html);
        setIsLoading(false);
      } else {
        setPageContent(loadedContent[currentSelectedPage]);
      }

      // Allow content to load.
      setTimeout(() => {
        scrollToHashElement();
      }, 100);
    })();
  }, [currentSelectedPage, scrollToHashElement]);

  const handleContentClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event?.target as HTMLElement;

      if (!target) {
        return;
      }

      // Find the closest anchor element
      const anchorElement = target.closest('a');

      if (!anchorElement) {
        return;
      }

      if (anchorElement.href.startsWith(INTERNAL_LINK)) {
        event.preventDefault();

        const page = extractWikiPage(anchorElement.href);

        if (page.pageName) {
          setCurrentSelectedPage(page.pageName);
        }
      }
    },
    []
  );

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full flex gap-1">
        <Sidebar
          data={menuItems}
          setCurrentSelectedPage={setCurrentSelectedPage}
          currentSelectedPage={currentSelectedPage}
          currentHash={currentHash}
          setCurrentHash={setCurrentHash}
        />
        <div className="markdown-body h-full w-full overflow-auto p-5 pb-10 dark:bg-raisin-black text-raisin-black dark:text-bright-gray">
          {!isLoading ? (
            <>
              <h2>{currentSelectedPage}</h2>
              <div
                ref={contentContainer}
                onClick={handleContentClick}
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </>
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <p className="inline-block text-gray">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wiki;
