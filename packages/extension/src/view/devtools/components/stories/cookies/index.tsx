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
import React, { useState } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import type { CookieData } from '../../../../../localStore';
import CookieTable from './cookieTable';

export interface CookiesProps {
  cookies: CookieData[];
}

const Cookies = ({ cookies }: CookiesProps) => {
  const [selectedCookie, setselectedCookie] = useState<CookieData | undefined>(
    undefined
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '70%',
        }}
        minHeight="30%"
        maxHeight="70%"
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
        }}
      >
        <CookieTable
          cookies={cookies}
          selectedKey={selectedCookie?.parsedCookie.name}
          onRowClick={setselectedCookie}
        />
      </Resizable>
    </div>
  );
};

export default Cookies;
