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
import { useTablePersistentSettingsStore } from '../../persistentSettingsStore';
export const columnResizeHandleClassName = 'column-resize-handle';

const getColumnElement = (columnId: string) => {
  return document.querySelector(
    `[data-column-resize-id="${columnId}"]`
  ) as HTMLElement;
};

const getColumnMinWidth = (columnElement: HTMLElement) => {
  return Number(columnElement?.dataset.minWidth) || 0;
};

const getColumnMaxWidth = (columnElement: HTMLElement) => {
  return Number(columnElement?.dataset.maxWidth) || Number.POSITIVE_INFINITY;
};

const getColumnWidth = (columnElement: HTMLElement) => {
  return (
    columnElement.getBoundingClientRect().width ||
    parseFloat(columnElement.style.width)
  );
};

const setColumnWidth = (columnElement: HTMLElement, width: number | string) => {
  const parsedWidth = typeof width === 'string' ? parseFloat(width) : width;
  columnElement.style.width = `${parsedWidth}px`;
  columnElement.style.minWidth = `${parsedWidth}px`;
  columnElement.style.maxWidth = `${parsedWidth}px`;
};

const setColumnFullWidth = (columnElement: HTMLElement) => {
  columnElement.style.width = '100%';
  columnElement.style.minWidth = '100%';
  columnElement.style.maxWidth = '100%';
};

const getColumnInitialWidth = (columnElement: HTMLElement) => {
  return Number(columnElement?.dataset.initialWidth) || undefined;
};

export type UseColumnResizing = {
  isResizing: boolean;
  setColumnWidths: () => void;
  tableContainerRef: React.RefObject<HTMLDivElement> | null;
  tableRef: React.RefObject<HTMLTableElement> | null;
};

type ColumnsSizing = Record<string, number>;

/**
 * Custom hook to handle column resizing.
 * @param tablePersistentSettingsKey - key to persist the columns sizing
 * @returns {UseColumnResizing} isResizing - Whether the column is being resized.
 */
const useColumnResizing = (
  tablePersistentSettingsKey?: string
): UseColumnResizing => {
  const [isResizing, setIsResizing] = useState(false);
  const startingColumnWidth = useRef(0);
  const startX = useRef(0);
  const rafId = useRef<number>();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const currentColumn = useRef<HTMLElement | null>(null);
  const [persistedColumnsSizing, setPersistedColumnsSizing] = useState<
    ColumnsSizing | undefined
  >(undefined);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target?.dataset?.columnResizeHandle) {
      event.stopPropagation();
      event.preventDefault();
      setIsResizing(true);
      const columnId = target.dataset.columnResizeHandle;
      startX.current = event.screenX;
      const columnElement = getColumnElement(columnId);
      if (columnElement) {
        startingColumnWidth.current = getColumnWidth(columnElement) || 0;
        currentColumn.current = columnElement;
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !currentColumn.current) {
        return;
      }

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!currentColumn.current) {
          return;
        }
        const columnElement = currentColumn.current;
        if (!columnElement) {
          return;
        }
        const minWidth = getColumnMinWidth(columnElement);
        const maxWidth = getColumnMaxWidth(columnElement);
        const newDiffX = startX.current - event.screenX;
        const newWidth = startingColumnWidth.current - newDiffX;
        // not allow resizing to be less than minWidth or greater than maxWidth
        if (newWidth > maxWidth || newWidth < minWidth) {
          return;
        }
        setColumnWidth(columnElement, newWidth);
      });
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    if (!isResizing || !currentColumn.current) {
      return;
    }
    const columnElement = currentColumn.current;
    if (columnElement) {
      const columnId = columnElement.dataset.columnResizeId;
      if (!columnId) {
        return;
      }
      const width = getColumnWidth(columnElement) || 0;
      setPersistedColumnsSizing((prev) => {
        return { ...(prev || {}), [columnId]: width };
      });

      requestAnimationFrame(() => {
        currentColumn.current = null;
        setIsResizing(false);
      });
    }
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    currentColumn.current = null;
  }, [isResizing]);

  const handleMouseOut = useCallback(
    (event: MouseEvent) => {
      if (!event.relatedTarget && isResizing) {
        currentColumn.current = null;
        handleMouseUp();
      }
    },
    [isResizing, handleMouseUp]
  );

  const { getPreferences, setPreferences } = useTablePersistentSettingsStore(
    ({ actions }) => ({
      getPreferences: actions.getPreferences,
      setPreferences: actions.setPreferences,
    })
  );

  const [areSettingsLoaded, setAreSettingsLoaded] = useState(false);
  useEffect(() => {
    if (tablePersistentSettingsKey) {
      const columnsSizing = getPreferences(
        tablePersistentSettingsKey,
        'columnsSizing'
      );

      const data =
        columnsSizing && Object.keys(columnsSizing).length > 0
          ? columnsSizing
          : undefined;

      setPersistedColumnsSizing(data as ColumnsSizing);
    }
    setAreSettingsLoaded(true);
  }, [getPreferences, tablePersistentSettingsKey]);

  // keep store in sync with the persisted columns sizing
  useEffect(() => {
    if (persistedColumnsSizing && tablePersistentSettingsKey) {
      setPreferences(
        {
          columnsSizing: persistedColumnsSizing,
        },
        tablePersistentSettingsKey
      );
    }
  }, [persistedColumnsSizing, setPreferences, tablePersistentSettingsKey]);

  // fixes the column widths when the component is mounted
  // so the columns don't resize when the user starts dragging
  const setColumnWidths = useCallback(() => {
    if (!areSettingsLoaded || isResizing) {
      return;
    }

    const allHandles = document.querySelectorAll(`[data-column-resize-id]`);
    const lastHandleId = (allHandles[allHandles.length - 1] as HTMLElement)
      ?.dataset?.columnResizeId;

    // calculate initial column widths
    const columnsSizing: ColumnsSizing = {};
    if (allHandles.length === 0) {
      return;
    }

    Array.from(allHandles).forEach((handle) => {
      const columnId = (handle as HTMLElement).dataset.columnResizeId;
      if (!columnId) {
        return;
      }
      const columnElement = getColumnElement(columnId);
      if (!columnElement) {
        return;
      }

      if (columnId === lastHandleId) {
        setColumnFullWidth(columnElement);
        return;
      }

      // use persisted columns sizing if available
      if (persistedColumnsSizing?.[columnId]) {
        setColumnWidth(columnElement, persistedColumnsSizing[columnId]);
        return;
      }

      const initialWidth = getColumnInitialWidth(columnElement);
      const minWidth = getColumnMinWidth(columnElement);
      const maxWidth = getColumnMaxWidth(columnElement);
      const colWidth = getColumnWidth(columnElement);
      let width = 0;
      if (initialWidth) {
        if (initialWidth > maxWidth) {
          width = maxWidth;
        } else if (initialWidth < minWidth) {
          width = minWidth;
        } else {
          width = initialWidth;
        }
      } else {
        if (colWidth > maxWidth) {
          width = maxWidth;
        } else if (colWidth < minWidth) {
          width = minWidth;
        } else {
          width = colWidth;
        }
      }
      setColumnWidth(columnElement, width);
      columnsSizing[columnId] = width;
    });

    // persist columns sizing if not already set
    if (!persistedColumnsSizing) {
      setPersistedColumnsSizing(columnsSizing);
    }

    if (tableRef.current) {
      if (allHandles.length === 1) {
        tableRef.current.style.width = '100%';
      } else {
        // allow table to resized freely after all columns are set
        tableRef.current.style.width = 'auto';
      }
    }
  }, [areSettingsLoaded, persistedColumnsSizing, isResizing]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseOut,
    handleMouseUp,
    tableContainerRef,
  ]);

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

  return { isResizing, setColumnWidths, tableContainerRef, tableRef };
};

export default useColumnResizing;
