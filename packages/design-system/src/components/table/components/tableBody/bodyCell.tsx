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
import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

/**
 * Internal dependencies.
 */
import type { InfoType, TableRow } from '../../useTable';
import { CookieTableData } from '@ps-analysis-tool/common';
interface BodyCellProps {
  cell: React.JSX.Element | InfoType;
  width: number;
  isHighlighted?: boolean;
  isRowFocused: boolean;
  row: TableRow;
  onRowClick: () => void;
}

const BodyCell = ({
  onRowClick,
  row,
  cell,
  width,
  isRowFocused,
  isHighlighted = false,
}: BodyCellProps) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [columnPosition, setColumnPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const x = e.clientX,
        y = e.clientY;
      onRowClick();
      setColumnPosition({ x, y });
      document.body.style.overflow = contextMenuOpen ? 'auto' : 'hidden';
      setContextMenuOpen(!contextMenuOpen);
    },
    [contextMenuOpen, onRowClick]
  );

  const [domain, name] = useMemo(
    () => [
      (row?.originalData as CookieTableData)?.parsedCookie?.domain,
      (row?.originalData as CookieTableData)?.parsedCookie?.name,
    ],
    [row?.originalData]
  );

  const handleCopy = useCallback(() => {
    try {
      // Need to do this since chrome doesnt allow the clipboard access in extension.
      const copyFrom = document.createElement('textarea');
      copyFrom.textContent = `cookie-domain:${domain} cookie-name:${name}`;
      document.body.appendChild(copyFrom);
      copyFrom.select();
      document.execCommand('copy');
      copyFrom.blur();
      document.body.removeChild(copyFrom);
      setContextMenuOpen(false);
    } catch (error) {
      //Fail silently
    }
  }, [domain, name]);

  return (
    <div
      tabIndex={0}
      onContextMenu={handleRightClick}
      style={{ maxWidth: width }}
      className={`box-border outline-0 px-1 py-px truncate h-5 text-xs ${
        isHighlighted
          ? `${
              isRowFocused ? 'text-white' : 'dark:text-dirty-red text-dirty-red'
            }`
          : 'dark:text-bright-gray'
      } cursor-default flex-1`}
    >
      {cell}
      <>
        {domain &&
          name &&
          contextMenuOpen &&
          createPortal(
            <div className="transition duration-100" data-testid="column-menu">
              <div
                className="absolute z-50 text-raisin-black dark:text-bright-gray rounded-md backdrop-blur-2xl w-screen max-w-[13rem] p-1.5 mr-2 divide-neutral-300 dark:divide-neutral-500 max-h-[78vh] overflow-auto bg-stone-200 dark:bg-neutral-700 shadow-3xl"
                style={{
                  left:
                    'min( calc( 100vw - 15rem),' + columnPosition.x + 'px )',
                  top: columnPosition.y + 'px',
                  border: '0.5px solid rgba(0, 0, 0, 0.20)',
                }}
              >
                <button
                  onClick={handleCopy}
                  className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-royal-blue hover:text-white cursor-default"
                >
                  <span>Copy network filter string</span>
                </button>
              </div>

              <div
                data-testid="column-menu-overlay"
                onClick={() => setContextMenuOpen(false)}
                className="absolute w-screen h-screen z-10 top-0 left-0"
              />
            </div>,
            document.body
          )}
      </>
    </div>
  );
};

export default BodyCell;
