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
import { throttle } from 'lodash-es';
export const columnResizeHandleClassName = 'column-resize-handle';

type UseColumnResizing = {
  isResizing: boolean;
  setColumnWidths: () => void;
};

/**
 * Custom hook to handle column resizing.
 * @returns {UseColumnResizing} isResizing - Whether the column is being resized.
 */
const useColumnResizing = (): UseColumnResizing => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const startingColumnWidth = useRef(0);
  const startX = useRef(0);
  const rafId = useRef<number>();

  // TODO: use some kind of key to get the column element
  const getColumnElement = () => {
    return resizeHandleRef.current?.parentElement?.parentElement;
  };

  const onMouseDown = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.className?.includes?.(columnResizeHandleClassName)) {
      // @ts-ignore
      resizeHandleRef.current = target as HTMLDivElement;
      startX.current = event.screenX;
      const columnElementRef = getColumnElement();
      if (!columnElementRef) {
        return;
      }
      startingColumnWidth.current =
        columnElementRef.getBoundingClientRect().width;
      setIsResizing(true);
    }
  }, []);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !resizeHandleRef.current) {
        return;
      }

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        const columnElement = getColumnElement();
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
    if (!isResizing) {
      return;
    }
    const columnElement = getColumnElement();
    if (columnElement) {
      requestAnimationFrame(() => {
        setIsResizing(false);
      });
    }
  }, [isResizing]);

  // fixes the column widths when the component is mounted
  // so the columns don't resize when the user starts dragging
  const setColumnWidths = () => {
    const allHandles = document.querySelectorAll(
      `.${columnResizeHandleClassName}`
    );
    allHandles.forEach((handle) => {
      const columnElement = handle.parentElement?.parentElement;
      if (columnElement) {
        const width = columnElement.getBoundingClientRect().width;
        columnElement.style.maxWidth = `${width}px`;
        columnElement.style.minWidth = `${width}px`;
      }
    });
  };

  useEffect(() => {
    const throttledMouseMove = throttle(onMouseMove, 10);
    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('resize', setColumnWidths);
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', setColumnWidths);
    };
  }, [onMouseDown, onMouseMove, onMouseUp]);

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
  }, []);

  return { isResizing, setColumnWidths };
};

export default useColumnResizing;
