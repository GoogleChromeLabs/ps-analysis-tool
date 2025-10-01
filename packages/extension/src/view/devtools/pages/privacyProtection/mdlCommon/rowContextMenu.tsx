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
 * External dependencies
 */
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  isValidURL,
  type MDLTableData,
  type PRTMetadata,
} from '@google-psat/common';
import type { TableRow } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

type ContextMenuProp = {
  tab: string;
};

const RowContextMenuForPRT = forwardRef<
  {
    onRowContextMenu: (e: React.MouseEvent<HTMLElement>, row: TableRow) => void;
  },
  ContextMenuProp
>(function RowContextMenu({ tab }: ContextMenuProp, ref) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [columnPosition, setColumnPosition] = useState({
    x: 0,
    y: 0,
  });
  const [data, setMetadata] = useState<PRTMetadata | MDLTableData | null>(null);
  const domain = useMemo(() => {
    if (!data) {
      return null;
    }

    if (tab === 'PRT') {
      if (isValidURL((data as PRTMetadata)?.origin)) {
        return new URL((data as PRTMetadata)?.origin).hostname;
      } else {
        return '';
      }
    }

    if (tab === 'scriptBlocking') {
      if ((data as MDLTableData)?.domain) {
        return (data as MDLTableData)?.highlighted
          ? (data as MDLTableData)?.domain
          : '';
      }
    }
    return '';
  }, [data, tab]);

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, { originalData }: TableRow) => {
      e.preventDefault();
      const x = e.clientX,
        y = e.clientY;
      setColumnPosition({ x, y });
      document.body.style.overflow = contextMenuOpen ? 'auto' : 'hidden';
      setContextMenuOpen(!contextMenuOpen);
      setMetadata(originalData as PRTMetadata);
    },
    [contextMenuOpen]
  );

  useImperativeHandle(ref, () => ({
    onRowContextMenu(e, row) {
      handleRightClick(e, row);
    },
  }));

  const handleFilterClick = useCallback(() => {
    const filter = `${
      tab === 'PRT' ? 'has-request-header:sec-probabilistic-reveal-token ' : ''
    }domain:${domain}`;

    // @ts-ignore
    if (chrome.devtools.panels?.network?.show) {
      // @ts-ignore
      chrome.devtools.panels.network.show({ filter });
      setContextMenuOpen(false);
      return;
    }

    try {
      // Need to do this since chrome doesnt allow the clipboard access in extension.
      const copyFrom = document.createElement('textarea');
      copyFrom.textContent = filter;
      document.body.appendChild(copyFrom);
      copyFrom.select();
      document.execCommand('copy');
      copyFrom.blur();
      document.body.removeChild(copyFrom);
      setContextMenuOpen(false);
    } catch (error) {
      //Fail silently
    }
  }, [domain, tab]);

  return (
    <>
      {domain &&
        contextMenuOpen &&
        createPortal(
          <div className="transition duration-100" data-testid="column-menu">
            <div
              className="absolute z-50 text-raisin-black dark:text-bright-gray rounded-md backdrop-blur-2xl p-1.5 mr-2 divide-neutral-300 dark:divide-neutral-500 max-h-[78vh] bg-stone-200 dark:bg-neutral-700 shadow-3xl"
              style={{
                left: 'min( calc( 100vw - 15rem),' + columnPosition.x + 'px )',
                top: columnPosition.y + 'px',
                border: '0.5px solid rgba(0, 0, 0, 0.20)',
              }}
            >
              <button
                onClick={handleFilterClick}
                className="w-full text-xs rounded px-1 py-[3px] flex items-center hover:bg-blueberry hover:text-white cursor-default"
              >
                <span>
                  {
                    // @ts-ignore
                    chrome.devtools.panels?.network?.show
                      ? tab === 'scriptBlocking'
                        ? 'Show requests with this domain.'
                        : 'Show requests with this token.'
                      : I18n.getMessage('copyNetworkFilter')
                  }
                </span>
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
  );
});

export default RowContextMenuForPRT;
