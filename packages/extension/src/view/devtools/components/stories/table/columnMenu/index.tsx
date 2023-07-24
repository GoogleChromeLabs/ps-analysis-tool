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
import ColumnList from './columnList';
import type { TData } from '..';
import { createPortal } from 'react-dom';

interface ColumnMenuProps {
  table: Table<TData>;
  columns: Column<TData, unknown>[];
  open: boolean;
  onClose: (value: boolean) => void;
}

const ColumnMenu = ({ table, columns, open, onClose }: ColumnMenuProps) => {
  const handleClose = () => {
    document.body.style.overflow = open ? 'auto' : 'hidden';
    onClose(!open);
  };

  return (
    <>
      {open && (
        <>
          <div className="relative">
            <div className="absolute z-20 bg-white rounded-lg max-w-lg w-fit border shadow-2xl shadow-slate-500 border-grsy-300 divide-y py-4">
              <div className="flex justify-between items-center p-4 pt-0">
                <p className="font-bold mr-4 leading-none text-gray-900 text-center">
                  Toggle Columns Visibility
                </p>
                <button
                  className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
              <label className="block w-full px-8 py-4 font-semibold hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={table.getIsAllColumnsVisible()}
                  onChange={table.getToggleAllColumnsVisibilityHandler()}
                />
                Toggle All
              </label>
              <ColumnList columns={columns} />
            </div>
          </div>
          {createPortal(
            <div
              onClick={handleClose}
              className="absolute w-screen h-screen z-10 bg-white opacity-80 top-0 left-0"
            />,
            document.body
          )}
        </>
      )}
    </>
  );
};

export default ColumnMenu;
