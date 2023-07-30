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
import React from 'react';
import type { Column, Table } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import type { TData } from '..';
import { createPortal } from 'react-dom';
import ColumnList from './columnList';

interface ColumnMenuProps {
  table: Table<TData>;
  columns: Column<TData, unknown>[];
  open: boolean;
  onClose: (value: boolean) => void;
}

const ColumnMenu = ({ table, columns, open, onClose }: ColumnMenuProps) => {
  const [startAnimation, setStartAnimation] = React.useState(false);

  const handleClose = () => {
    document.body.style.overflow = open ? 'auto' : 'hidden';
    setStartAnimation(true);
    setTimeout(() => {
      onClose(!open);
      setStartAnimation(false);
    }, 300);
  };

  return (
    <>
      {open &&
        createPortal(
          <div
            className={`transition duration-300 ${
              startAnimation ? 'opacity-0' : 'opacity-100'
            }`}
            data-testid="column-menu"
          >
            <div className="absolute top-10 left-2 z-20 bg-white rounded-lg w-screen max-w-[15rem] border shadow-2xl shadow-slate-500 border-gray-300 px-2 py-2 mr-2 divide-y divide-neutral-300 max-h-[80vh] overflow-auto bg-stone-200">
              <button
                className="block w-full text-sm rounded px-4 py-1 mt-1 mb-2 flex items-center font-semibold hover:bg-royal-blue hover:text-white cursor-pointer"
                onClick={(e) => {
                  table.getToggleAllColumnsVisibilityHandler()(e);
                  handleClose();
                }}
              >
                <span
                  className={`mr-2 font-bold ${
                    table.getIsAllColumnsVisible() ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  ✓
                </span>
                <span>Toggle All</span>
              </button>
              <ColumnList columns={columns} handleClose={handleClose} />
            </div>

            <div
              data-testid="column-menu-overlay"
              onClick={handleClose}
              className="absolute w-screen h-screen z-10 top-0 left-0"
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default ColumnMenu;
