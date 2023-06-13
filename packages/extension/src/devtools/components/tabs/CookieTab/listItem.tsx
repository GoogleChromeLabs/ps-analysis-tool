/**
 * External dependencies.
 */
import React from 'react';

/**
 * Internal dependencies.
 */
import { CookieData } from '../../../../cookieStore';

interface IListItem {
  cookie: CookieData;
}

const ListItem = ({ cookie }: IListItem) => {
  return (
    <a href="#" className="block hover:bg-secondary">
      <div className="px-4 py-3 sm:px-6 border-b">
        <div className="flex items-center justify-between">
          <div className="font-medium w-full flex items-center justify-between">
            <span className="text-sm truncate">{cookie.parsedData.name}</span>
          </div>
        </div>
        <div className="mt-0.5">
          <div className="truncate text-xs text-secondary">
            <span>{cookie.parsedData.value}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ListItem;
