/*
 * Copyright 2025 Google LLC
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

/**
 * Internal dependencies.
 */
import { ArrowDown } from '../../../../icons';

interface PaginationProps {
  pages: number;
  setPage: (page: number) => void;
  selectedPage: number;
}

const Pagination = ({ pages, setPage, selectedPage }: PaginationProps) => {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
  const startPage =
    selectedPage >= pages - 2 ? pages - 4 : Math.max(1, selectedPage - 1);
  const endPage = startPage + 4 > pages ? pages : startPage + 4;

  return (
    <div className="flex justify-center items-center gap-2 text-xs">
      <button
        className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center disabled:opacity-50"
        onClick={() => setPage(Math.max(0, selectedPage - 1))}
        disabled={selectedPage === 0}
      >
        <ArrowDown className="rotate-90" />
      </button>
      {pageNumbers.map((page) => {
        if (page < startPage || page > endPage) {
          return null;
        }

        return (
          <button
            key={page}
            className={classNames(
              'w-4 h-4 bg-gray-200 rounded flex items-center justify-center',
              {
                'bg-blue-500 text-white': selectedPage === page - 1,
                'text-gray-700': selectedPage !== page - 1,
              }
            )}
            onClick={() => setPage(page - 1)}
          >
            {page}
          </button>
        );
      })}
      <button
        className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center disabled:opacity-50"
        onClick={() => setPage(Math.min(pages - 1, selectedPage + 1))}
        disabled={selectedPage === pages - 1}
      >
        <ArrowDown className="-rotate-90" />
      </button>
    </div>
  );
};

export default Pagination;
