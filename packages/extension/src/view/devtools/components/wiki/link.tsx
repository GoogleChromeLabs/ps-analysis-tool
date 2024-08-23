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

/**
 * Internal dependencies.
 */
import { ExternalLinkIcon } from '@google-psat/design-system';

export interface MenuItem {
  name: string;
  link?: string;
  menu?: MenuItem[];
}

interface LinkProps {
  item: MenuItem;
  setCurrentSelectedPage: Dispatch<SetStateAction<string>>;
}

const Link = ({ item, setCurrentSelectedPage }: LinkProps) => {
  const handleClick = useCallback(() => {
    if (item.name && !item.link) {
      setCurrentSelectedPage(item.name);
    }
  }, [item.name, item.link, setCurrentSelectedPage]);

  const isLink = Boolean(item?.link);

  return (
    <a
      href={isLink ? item.link : '#'}
      target={isLink ? '__blank' : '_self'}
      onClick={handleClick}
    >
      {item.name}
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
