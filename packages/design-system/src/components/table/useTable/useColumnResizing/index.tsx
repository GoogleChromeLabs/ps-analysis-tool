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

/**
 * Custom hook to handle column resizing.
 */

const useColumnResizing = () => {
  const [isResizing, setIsResizing] = useState(false);
  const columnWidth = useRef(0);
  const startX = useRef(0);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.className.includes('column-resize-handle')) {
      // @ts-ignore
      resizeHandleRef.current = target as HTMLDivElement;
      startX.current = event.screenX;
      const columnElementRef = resizeHandleRef.current.parentElement;
      if (!columnElementRef) {
        return;
      }
      columnWidth.current = columnElementRef.offsetWidth;
      setIsResizing(true);
    }
  }, []);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !resizeHandleRef.current) {
        return;
      }
      const columnElement = resizeHandleRef.current.parentElement;
      if (!columnElement) {
        return;
      }
      const newDiffX = startX.current - event.screenX;
      columnElement.style.minWidth = `${columnWidth.current - newDiffX}px`;
    },
    [isResizing, columnWidth]
  );

  const onMouseUp = useCallback(() => {
    if (!isResizing) {
      return;
    }
    const columnElement = resizeHandleRef.current?.parentElement;
    if (columnElement) {
      columnWidth.current = columnElement.offsetWidth;
      requestAnimationFrame(() => {
        setIsResizing(false);
      });
    }
  }, [isResizing]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [onMouseMove, onMouseUp, onMouseDown]);

  return { isResizing };
};

export default useColumnResizing;
