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

import React from 'react';
import { HEADER_TITLE } from '../constants/site-config';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background border-hex-gray bg-white">
      <div className="container flex h-16 items-center justify-between py-2 px-4 lg:max-w-none">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="items-center space-x-2 flex">
            <img
              src="/assets/images/sandbox_icon.png"
              height="30px"
              width="30px"
            />
            <span className="text-2xl text-[#5f6368]">{HEADER_TITLE}</span>
          </a>
        </div>
        <div>
          <a
            href="https://privacysandbox.com/"
            target="_blank"
            className="px-4 py-3 text-[#06f] text-sm transition ease-in-out duration-300 active:bg-[#cce7f5] hover:bg-[#f6fcff] hover:text-[#03c] active:text-[#03c] rounded"
            rel="noreferrer"
          >
            Docs
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
