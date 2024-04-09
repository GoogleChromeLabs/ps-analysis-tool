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
 * External dependencies
 */
import React, { useCallback } from 'react';
import { LibraryDetection } from '@ps-analysis-tool/library-detection';
import { Button } from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import './app.css';
import {
  CookiesSection,
  BlockedCookiesSection,
  FramesSection,
} from './components';

const App = () => {
  const print = useCallback(() => {
    window.print();
  }, []);

  const expandAndPrint = useCallback(() => {
    Array.from(document.querySelectorAll('button'))
      .filter((button) => button.innerText === 'Expand View')
      .forEach((bt) => bt.click());
    setTimeout(() => {
      window.print();
      Array.from(document.querySelectorAll('button'))
        .filter((button) => button.innerText === 'Collapse View')
        .forEach((bt) => bt.click());
    }, 1);
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="absolute flex flex-col gap-2 top-5 right-5 text-sm print:hidden">
        <Button text={'Print'} onClick={print} />
        <Button text={'Expand and print'} onClick={expandAndPrint} />
      </div>
      <CookiesSection />
      <BlockedCookiesSection />
      <div className="text-xs">
        <LibraryDetection />
      </div>
      <FramesSection />
    </div>
  );
};

export default App;
