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
import React, { type Dispatch, type SetStateAction, useCallback } from 'react';
import classNames from 'classnames';
import { ExternalLinkIcon } from '@google-psat/design-system';

export interface MenuItemType {
  name: string;
  link?: string;
  menu?: MenuItemType[];
}

interface LinkProps {
  item: MenuItemType;
  name: string;
  link: string | undefined;
  pageName: string;
  hash?: string | null;
  setCurrentSelectedPage: Dispatch<SetStateAction<string>>;
  currentSelectedPage: string;
  setCurrentHash: Dispatch<SetStateAction<string | null>>;
  currentHash: string | null;
}

const Link = ({
  link,
  name,
  pageName,
  setCurrentSelectedPage,
  currentSelectedPage,
  hash,
  setCurrentHash,
}: LinkProps) => {
  const isLink = !pageName && Boolean(link);

  const handleClick = useCallback(() => {
    if (pageName && !isLink) {
      setCurrentHash(hash ?? null);
      setCurrentSelectedPage(pageName);
    }
  }, [pageName, isLink, hash, setCurrentHash, setCurrentSelectedPage]);

  return (
    <a
      href={isLink ? link : '#'}
      target={isLink ? '__blank' : '_self'}
      onClick={handleClick}
      className={classNames('text-[13px] block', {
        'decoration-solid': currentSelectedPage === name,
      })}
    >
      {name}
      {isLink && (
        <ExternalLinkIcon
          className="inline-block ml-1 color-royal-blue"
          width="14"
          height="14"
        />
      )}
    </a>
  );
};

export default Link;
