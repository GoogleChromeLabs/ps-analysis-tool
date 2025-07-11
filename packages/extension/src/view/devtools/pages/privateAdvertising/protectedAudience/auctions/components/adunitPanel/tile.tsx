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
import classNames from 'classnames';
import React from 'react';

interface TileProps {
  item: {
    name: string;
    pills: { name: string; onClick?: () => void; className?: string }[];
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  };
}

const Tile = ({ item }: TileProps) => {
  const Icon = item?.Icon;

  return (
    <div
      key={item.name}
      className="min-w-72 h-fit border border-chinese-silver px-3 py-4 rounded"
    >
      <div className="flex gap-2 justify-start items-center mb-3 text-base text-raisin-black dark:text-bright-gray">
        {Icon && <Icon width={20} height={20} className="fill-gray" />}
        <h4>{item.name}</h4>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-6">
        {item.pills?.length ? (
          item.pills.map((pill) => {
            return (
              <div
                className={classNames(
                  'bg-cultured-grey text-raisin-black py-1 px-4 rounded-full border border-dark-grey text-xs',
                  {
                    'hover:border-american-silver cursor-pointer hover:bg-light-gray hover:scale-[1.03] transition-all duration-150 ease-in-out':
                      pill.onClick,
                  },
                  {
                    'pointer-none': !pill.onClick,
                  },
                  pill.className
                )}
                key={pill.name}
                onClick={pill?.onClick}
              >
                {pill.name}
              </div>
            );
          })
        ) : (
          <>
            <p className="text-sm text-gray-500 py-1 px-4">No data available</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Tile;
