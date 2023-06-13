/**
 * External dependencies.
 */
import React from 'react';

/**
 * Internal dependencies.
 */
import { CookieData } from '../../../../cookieStore';
import ListItem from './listItem';

interface ICoookieList {
  cookies: {
    [key: string]: CookieData;
  };
  selectedKey: string | null;
  onClickItem: (key: string) => void;
}

const CookieList = ({ cookies, selectedKey, onClickItem }: ICoookieList) => (
  <ul className="w-full h-full">
    {Object.entries(cookies).map(([key, value]) => (
      <li key={key}>
        <ListItem
          cookie={value}
          isSelected={selectedKey === key}
          onClick={() => onClickItem(key)}
        />
      </li>
    ))}
  </ul>
);
export default CookieList;
