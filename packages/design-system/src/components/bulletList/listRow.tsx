/*
 * Copyright 2023 Google LLC
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
import React, { useCallback } from 'react';

/**
 * Internal dependencies.
 */
import { Ellipse } from '../../icons';
import { useSidebar } from '../sidebar';

type Props = {
  row: BulletListItem;
};

const ListRow = ({ row }: Props) => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);

  const handleClick = useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();

      if (row?.sidebarKey) {
        navigateTo(row.sidebarKey);
        return;
      }

      if (chrome?.tabs) {
        try {
          await chrome.tabs.update({
            url: row.link,
          });
        } catch (error) {
          console.log('Failed to open link:', error);
        }
      }
    },
    [navigateTo, row.link, row.sidebarKey]
  );

  return (
    <div className="flex gap-4 items-baseline" key={row?.key ?? row.title}>
      <span>
        <Ellipse />
      </span>
      {row?.link ? (
        <a
          title={row.link}
          href={row.link}
          onClick={handleClick}
          className="text-sm text-bright-navy-blue dark:text-jordy-blue font-medium leading-6"
        >
          {row.title}
        </a>
      ) : (
        <p className="text-sm font-medium leading-6">{row.title}</p>
      )}
    </div>
  );
};

export default ListRow;
