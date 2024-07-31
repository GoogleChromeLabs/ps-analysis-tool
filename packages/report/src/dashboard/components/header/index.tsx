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
import { PrivacySandboxColoredIcon } from '@google-psat/design-system';

interface HeaderProps {
  url: string | undefined | null;
  dateTime: string;
}

const Header = ({ url, dateTime }: HeaderProps) => {
  // @ts-ignore - Global object.
  const isExtension = globalThis?.PSAT_EXTENSION;

  return (
    <div className="flex justify-between gap-3 px-4 py-2">
      <div className="flex gap-2 items-center">
        <PrivacySandboxColoredIcon className="w-[40px] h-[40px]" />
        <div>
          {url && <p className="text-xs mb-[1px]">{url}</p>}
          <p className="text-xs mb-[1px]">{dateTime}</p>
        </div>
      </div>
      <div className="flex items-center text-cente">
        {isExtension ? 'PSAT Extension Analysis' : 'PSAT CLI Analysis'}
      </div>
    </div>
  );
};

export default Header;
