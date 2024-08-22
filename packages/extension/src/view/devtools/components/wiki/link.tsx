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
import React, { type Dispatch, type SetStateAction } from 'react';

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
  return (
    <a
      href={item?.link ? item.link : '#'}
      target={item?.link ? '__blank' : '_self'}
      onClick={() => setCurrentSelectedPage(item.name)}
    >
      {item.name}
    </a>
  );
};

export default Link;
