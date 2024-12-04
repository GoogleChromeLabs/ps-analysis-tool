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
    buttons: { name: string; onClick?: () => void }[];
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
      <div className="flex gap-2 justify-start items-center mb-3 text-base">
        {Icon && <Icon width={20} height={20} className="fill-gray" />}
        <h4>{item.name}</h4>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-6">
        {item.buttons &&
          item.buttons.map((button) => (
            <button
              className={classNames(
                'bg-cultured-grey text-raisin-black py-1 px-4 rounded border border-dark-grey text-xs',
                {
                  'hover:border-american-silver hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:scale-[1.03] transition-all duration-150 ease-in-out':
                    button.onClick,
                },
                {
                  'cursor-default': !button.onClick,
                }
              )}
              key={button.name}
              onClick={button?.onClick}
            >
              {button.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Tile;
