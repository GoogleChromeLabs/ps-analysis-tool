/**
 * External dependencies.
 */
import React, { useEffect, useState } from 'react';
import { Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../app/cookieStore';
import { CookieData } from '../../../cookieStore';

export const CookieTab = () => {
  const cookies = useCookieStore(({ state }) => state.cookies);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedKey && Object.keys(cookies).length !== 0) {
      setSelectedKey(Object.keys(cookies)[0]);
    }
  }, [cookies, selectedKey]);
  const selectedCookie = selectedKey ? cookies[selectedKey] : null;
  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="flex-1 overflow-y-scroll ">
        <CookieList
          cookies={cookies}
          selectedKey={selectedKey}
          onClickItem={setSelectedKey}
        />
      </div>
      <div className="flex-1 overflow-y-scroll border-t-gray-300 border-t-2 lg:border-t-0">
        {selectedCookie && <CookieDetails data={selectedCookie.parsedData} />}
      </div>
    </div>
  );
};
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

interface IListItem {
  cookie: CookieData;
  isSelected: boolean;
  onClick: () => void;
}

const ListItem = ({ cookie, isSelected, onClick }: IListItem) => {
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <a
      href="#"
      className={classNames(
        isSelected ? 'bg-secondary' : '',
        'block hover:bg-secondary'
      )}
      onClick={onClick}
    >
      <div className="px-4 py-3 sm:px-6 border-b">
        <div className="flex items-center justify-between">
          <div
            className={classNames(
              isSelected ? 'font-bold' : 'font-medium',
              'w-full flex items-center justify-between'
            )}
          >
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

interface ICookieDetails {
  data: ParsedCookie;
}

const CookieDetails = ({ data }: ICookieDetails) => (
  <div className="flex flex-col p-4 items-center">
    <h1 className="w-2/3 font-bold text-xl mb-2">{data.name}</h1>
    <div className=" w-2/3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Domain</h1>
        <p className="text-sm truncate">{data.domain}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Path</h1>
        <p className="text-sm truncate">{data.path}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Samesite</h1>
        <p className="text-sm truncate">{data.samesite}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg mr-2">Value</h1>
        <p className=" text-sm truncate">{data.value}</p>
      </div>
    </div>
  </div>
);
