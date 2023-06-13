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
}

const CookieList = ({ cookies }: ICoookieList) => (
  <ul className="w-full h-full">
    {Object.entries(cookies).map(([key, value]) => (
      <li key={key}>
        <ListItem cookie={value} />
      </li>
    ))}
  </ul>
);

export default CookieList;
