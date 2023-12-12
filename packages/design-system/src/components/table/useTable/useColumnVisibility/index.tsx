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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import type { TableColumn } from '..';

export type ColumnVisibilityOutput = {
  visibleColumns: TableColumn[];
  hideColumn: (key: string) => void;
  toggleVisibility: () => void;
  areAllColumnsVisible: boolean;
  showColumn: (key: string) => void;
  isColumnHidden: (key: string) => boolean;
};

const useColumnVisibility = (
  columns: TableColumn[],
  options?: Record<string, boolean>
): ColumnVisibilityOutput => {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const isDefaultRendered = useRef(false);

  const hideColumn = useCallback((key: string) => {
    setHiddenKeys((prev) => new Set(prev.add(key)));
  }, []);

  useEffect(() => {
    if (options && !isDefaultRendered.current) {
      setHiddenKeys((prev) => {
        const next = new Set(prev);
        columns
          .filter(({ enableHiding }) => enableHiding !== false)
          .forEach(({ header, accessorKey }) => {
            if (options[header]) {
              next.add(accessorKey);
            }
          });
        return next;
      });
      isDefaultRendered.current = true;
    }
  }, [columns, options]);

  const toggleVisibility = useCallback(() => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (
        next.size ===
        columns.filter(({ enableHiding }) => enableHiding !== false).length
      ) {
        next.clear();
      } else {
        columns
          .filter(({ enableHiding }) => enableHiding !== false)
          .forEach(({ accessorKey }) => {
            next.add(accessorKey);
          });
      }
      return next;
    });
  }, [columns]);

  const areAllColumnsVisible = useMemo(() => {
    return (
      hiddenKeys.size ===
      columns.filter(({ enableHiding }) => enableHiding !== false).length
    );
  }, [columns, hiddenKeys.size]);

  const showColumn = useCallback((key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isColumnHidden = useCallback(
    (key: string) => {
      return hiddenKeys.has(key);
    },
    [hiddenKeys]
  );

  const visibleColumns = useMemo(
    () => columns.filter(({ accessorKey }) => !hiddenKeys.has(accessorKey)),
    [columns, hiddenKeys]
  );

  return {
    visibleColumns,
    hideColumn,
    toggleVisibility,
    areAllColumnsVisible,
    showColumn,
    isColumnHidden,
  };
};

export default useColumnVisibility;
