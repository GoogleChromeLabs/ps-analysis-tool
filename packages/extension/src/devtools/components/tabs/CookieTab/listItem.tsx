/**
 * External dependencies.
 */
import React from 'react';

/**
 * Internal dependencies.
 */
import { CookieData } from '../../../../cookieStore';
import { isFirstParty } from '../../../../utils';

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
        <div
          className={
            'mt-4 flex justify-between items-center text-sm text-secondary'
          }
        >
          <span
            className="font-bold"
            style={{ color: getCategoryColor(cookie.analytics?.category) }}
          >
            {cookie.analytics?.category || 'Uncategorized'}
          </span>
          <span
            className={`
            ${
              isFirstParty(cookie.toplevel, cookie.parsedData.domain)
                ? 'text-first-party'
                : 'text-third-party'
            } font-bold`}
          >
            {isFirstParty(cookie.toplevel, cookie.parsedData.domain)
              ? 'First Party'
              : 'Third Party'}
          </span>
        </div>
      </div>
    </a>
  );
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Functional':
      return '#63c00c';
    case 'Marketing':
      return '#dd9a09';
    case 'Analytics':
      return '#8e0bda';
    default:
      return '#c90011';
  }
};

export default ListItem;
