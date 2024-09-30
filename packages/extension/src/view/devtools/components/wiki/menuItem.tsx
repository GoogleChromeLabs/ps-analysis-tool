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

/**
 * Internal dependencies.
 */
import extractWikiPage from '../../../../utils/extractWikiPage';
import Link, { type MenuItemType } from './link';

interface MenuItemProps {
  menuItem: MenuItemType;
  setCurrentSelectedPage: Dispatch<SetStateAction<string>>;
  setCurrentHash: Dispatch<SetStateAction<string | null>>;
  currentHash: string | null;
  currentSelectedPage: string;
  children?: React.ReactNode;
}

const MenuItem = ({
  menuItem,
  setCurrentSelectedPage,
  currentSelectedPage,
  setCurrentHash,
  currentHash,
  children,
}: MenuItemProps) => {
  const pageComponents = menuItem?.link ? extractWikiPage(menuItem.link) : null;

  const menuItemPageName = pageComponents
    ? pageComponents.pageName
    : menuItem.name;

  return (
    <li key={menuItemPageName} className="leading-5">
      <Link
        name={menuItem.name}
        pageName={menuItemPageName}
        link={menuItem?.link}
        hash={pageComponents ? pageComponents.hash : null}
        item={{ ...menuItem, name: menuItemPageName }}
        setCurrentSelectedPage={setCurrentSelectedPage}
        currentSelectedPage={currentSelectedPage}
        setCurrentHash={setCurrentHash}
        currentHash={currentHash}
      />
      {children}
    </li>
  );
};

export default MenuItem;
