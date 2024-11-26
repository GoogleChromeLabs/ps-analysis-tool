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
import { ProgressBar, useSidebar } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Sidebar, { type SidebarMenuItem } from './sidebar';
import parseMenuMarkDown from '../../../../utils/parseMenuMarkDown';
import convertMarkdownToHTML from '../../../../utils/convertMarkdownToHTML';
import extractWikiPage from '../../../../utils/extractWikiPage';
import convertTitleToHash from '../../../../utils/convertTitleToHash';

const GITHUB_URL =
  'https://raw.githubusercontent.com/wiki/GoogleChromeLabs/ps-analysis-tool';
const INTERNAL_LINK =
  'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki';
const IGNORE_LIST = ['Contributor Guide', 'Code of Conduct', 'Support Forum'];
const DEFAULT_PAGE = 'Home';

/**
enum for exporting page string to be passed as query inside useSidebar hook.
For page: PAGE = 'Page Url',
For page with has: PAGE_HASH = 'Page Url#Hash Url'
 */
export enum NAVIGATION_TAGS {
  EVALUATION_ENVIRONMENT = 'Evaluation Environment',
  PSAT_SETTINGS_AND_PERMISSIONS = 'PSAT Settings and Permissions',
}

const loadedContent: {
  [key: string]: string;
} = {};

const Wiki = () => {
  const [pageContent, setPageContent] = useState<string>('');
  const [menuItems, setMenuItems] = useState<SidebarMenuItem[] | undefined>();
  const [currentSelectedPage, setCurrentSelectedPage] = useState(DEFAULT_PAGE);
  const [currentHash, setCurrentHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const contentContainer = useRef<HTMLDivElement>(null);

  const { query, clearQuery } = useSidebar(({ state }) => ({
    query: state.activePanel.query,
    clearQuery: state.activePanel.clearQuery,
  }));

  useEffect(() => {
    if (query) {
      // NAVIGATION_TAGS are split here when passed as query
      const [page, hash] = query.split('#');
      setCurrentSelectedPage(page);
      setCurrentHash(hash ? hash : null);
      clearQuery?.();
    }
  }, [query, clearQuery]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const menuResponse = await fetch(GITHUB_URL + '/_Sidebar.md');
      const menuMarkdown = await menuResponse.text();
      const _menuItems = parseMenuMarkDown(menuMarkdown, IGNORE_LIST);

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
    let timeout: ReturnType<typeof setTimeout>;

    (async () => {
      if (!loadedContent[currentSelectedPage]) {
        setIsLoading(true);
        const fileName = currentSelectedPage.replaceAll(' ', '-') + '.md';

        try {
          const response = await fetch(GITHUB_URL + '/' + fileName);

          const markdown = await response.text();
          const mermaidJS = (await import('mermaid')).default;

          const html = await convertMarkdownToHTML(markdown, mermaidJS);

          loadedContent[currentSelectedPage] = html;

          setPageContent(html);
        } catch (error) {
          setPageContent('<p>Error loading page content.</p>');
        } finally {
          setIsLoading(false);
        }
      } else {
        setPageContent(loadedContent[currentSelectedPage]);
      }

      if (currentHash) {
        timeout = setTimeout(() => {
          scrollToHashElement();
        }, 500); // Allow content to load.
      } else {
        if (contentContainer.current) {
          contentContainer.current.scrollTop = 0;
        }
      }
    })();

    return () => {
      clearTimeout(timeout);
    };
  }, [currentSelectedPage, scrollToHashElement, currentHash]);

  const handleContentClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event?.target as HTMLElement;

      if (!target) {
        return;
      }

      const anchorElement = target.closest('a');

      if (anchorElement && anchorElement.href.startsWith(INTERNAL_LINK)) {
        event.preventDefault();

        const page = extractWikiPage(anchorElement.href);

        if (page.pageName) {
          setCurrentSelectedPage(page.pageName.replaceAll('-', ' '));
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
        <div
          ref={contentContainer}
          className="markdown-body h-full w-full overflow-auto p-5 pb-10 dark:bg-raisin-black text-raisin-black dark:text-bright-gray"
        >
          {!isLoading ? (
            <div className="markdown-container min-w-[50rem]">
              <h2>
                {currentSelectedPage
                  ? currentSelectedPage.replaceAll('-', ' ')
                  : ''}
              </h2>
              <div
                onClick={handleContentClick}
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <ProgressBar additionalStyles="w-1/6 mx-auto h-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wiki;
