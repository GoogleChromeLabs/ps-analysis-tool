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
import { useEffect, useRef, useState, useCallback } from 'react';
export const columnResizeHandleClassName = 'column-resize-handle';

const getColumnElement = (columnId: string) => {
  return document.querySelector(
    `[data-column-resize-id="${columnId}"]`
  ) as HTMLElement;
};

const getColumnWidth = (columnId: string) => {
  const columnElement = getColumnElement(columnId);
  if (!columnElement) {
    return 0;
  }
  return (
    Number(columnElement.style.width) ||
    columnElement.getBoundingClientRect().width
  );
};

type UseColumnResizing = {
  isResizing: boolean;
  setColumnWidths: () => void;
  tableContainerRef: React.RefObject<HTMLDivElement>;
};

/**
 * Custom hook to handle column resizing.
 * @returns {UseColumnResizing} isResizing - Whether the column is being resized.
 */
const useColumnResizing = (): UseColumnResizing => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeId = useRef<string | null>(null);
  const startingColumnWidth = useRef(0);
  const startX = useRef(0);
  const rafId = useRef<number>();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target?.dataset?.columnResizeHandle) {
      setIsResizing(true);
      resizeId.current = target.dataset.columnResizeHandle;
      startX.current = event.screenX;
      const columnElement = getColumnElement(resizeId.current);
      if (columnElement) {
        startingColumnWidth.current = getColumnWidth(resizeId.current);
      }
    }
  }, []);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !resizeId.current) {
        return;
      }

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!resizeId.current) {
          return;
        }
        const columnElement = getColumnElement(resizeId.current);
        if (!columnElement) {
          return;
        }
        const newDiffX = startX.current - event.screenX;
        const newWidth = startingColumnWidth.current - newDiffX;
        columnElement.style.minWidth = `${newWidth}px`;
        columnElement.style.maxWidth = `${newWidth}px`;
      });
    },
    [isResizing]
  );

  const onMouseUp = useCallback(() => {
    if (!isResizing || !resizeId.current) {
      return;
    }
    const columnElement = getColumnElement(resizeId.current);
    if (columnElement) {
      requestAnimationFrame(() => {
        setIsResizing(false);
      });
    }
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    resizeId.current = null;
  }, [isResizing]);

  // fixes the column widths when the component is mounted
  // so the columns don't resize when the user starts dragging
  const setColumnWidths = useCallback(() => {
    const allHandles = document.querySelectorAll(`[data-column-resize-handle]`);
    Array.from(allHandles).forEach((handle, index) => {
      const columnId = (handle as HTMLElement).dataset.columnResizeHandle;
      // console.log('columnId', columnId);
      if (!columnId) {
        return;
      }
      const columnElement = getColumnElement(columnId);
      if (!columnElement) {
        return;
      }

      // if the column is the last one, use all remaining space
      if (index === allHandles.length - 1) {
        columnElement.style.maxWidth = '100%';
        columnElement.style.width = '100%';
        columnElement.style.minWidth = '100%';
        return;
      }

      const width = getColumnWidth(columnId);
      columnElement.style.maxWidth = `${width}px`;
      columnElement.style.width = `${width}px`;
      columnElement.style.minWidth = `${width}px`;
    });
  }, []);

  useEffect(() => {
    const tableContainer = tableContainerRef?.current;
    if (tableContainer) {
      tableContainer.addEventListener('mousemove', onMouseMove);
      tableContainer.addEventListener('mouseup', onMouseUp);
      tableContainer.addEventListener('mousedown', onMouseDown);
      window.addEventListener('resize', setColumnWidths);
    }
    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener('mousemove', onMouseMove);
        tableContainer.removeEventListener('mouseup', onMouseUp);
        tableContainer.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('resize', setColumnWidths);
      }
    };
  }, [onMouseDown, onMouseMove, onMouseUp, setColumnWidths, tableContainerRef]);

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'ew-resize';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isResizing]);

  useEffect(() => {
    setColumnWidths();
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [setColumnWidths]);

  return { isResizing, setColumnWidths, tableContainerRef };
};

export default useColumnResizing;
