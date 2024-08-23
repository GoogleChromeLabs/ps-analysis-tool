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
import React, { useEffect, useState } from 'react';
import 'github-markdown-css';

/**
 * Internal dependencies.
 */
import Sidebar, { type SidebarMenuItem } from './sidebar';
import parseMenuMarkup from './parseMenuMarkup';
import convertMarkupToHTML from './convertMarkupToHTML';

const GITHUB_URL =
  'https://raw.githubusercontent.com/wiki/GoogleChromeLabs/ps-analysis-tool';

const Wiki = () => {
  const [pageContent, setPageContent] = useState<string>('');
  const [menuItems, setMenuItems] = useState<SidebarMenuItem[] | undefined>();
  const [currentSelectedPage, setCurrentSelectedPage] = useState('Home');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const menuResponse = await fetch(GITHUB_URL + '/_Sidebar.md');
      const menuMarkdown = await menuResponse.text();
      const _menuItems = parseMenuMarkup(menuMarkdown, [
        'Contributor Guide',
        'Code of Conduct',
        'Support Forum',
      ]);

      setMenuItems(_menuItems);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const fileName = currentSelectedPage.replaceAll(' ', '-') + '.md';
      const response = await fetch(GITHUB_URL + '/' + fileName);

      const markdown = await response.text();
      const html = await convertMarkupToHTML(markdown);

      setPageContent(html);
      setIsLoading(false);
    })();
  }, [currentSelectedPage]);

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full flex gap-1">
        <Sidebar
          data={menuItems}
          setCurrentSelectedPage={setCurrentSelectedPage}
          currentSelectedPage={currentSelectedPage}
        />
        <div className="markdown-body h-full w-full overflow-auto p-5 pb-10 dark:bg-raisin-black text-raisin-black dark:text-bright-gray">
          {!isLoading ? (
            <>
              <h2>{currentSelectedPage}</h2>
              <div dangerouslySetInnerHTML={{ __html: pageContent }} />
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
