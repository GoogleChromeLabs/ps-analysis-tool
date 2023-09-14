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
import type { CellContext } from '@tanstack/react-table';
import React, { useCallback, useState, useRef, useEffect } from 'react';

/**
 * Internal dependencies.
 */
import type { CookieTableData } from '../../../../../cookies.types';
import { useCookieStore } from '../../../../../stateProviders/syncCookieStore';
import { getCookieKey } from '../../../../../../../utils/getCookieKey';
import classNames from 'classnames';

interface EditableCheckBoxInputProps {
  info: CellContext<CookieTableData, unknown>;
  changedKey: string;
}

const EditableCheckBoxInput = ({
  info,
  changedKey,
}: EditableCheckBoxInputProps) => {
  const [editing, setEditing] = useState(false);
  const divRef = useRef<HTMLInputElement>(null);

  const [localValue, setLocalValue] = useState<boolean>(
    info.getValue() as boolean
  );
  const { modifyCookie } = useCookieStore(({ actions }) => ({
    modifyCookie: actions.modifyCookie,
  }));

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.detail === 2) {
        setEditing(true);
      }
    },
    []
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setEditing(false);
        if (localValue !== info.getValue()) {
          modifyCookie(
            getCookieKey(info.row.original.parsedCookie),
            changedKey,
            localValue,
            null
          );
        }
      }
    },
    [info, changedKey, localValue, modifyCookie]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="h-full w-full flex items-center"
      onClick={(event) => handleDoubleClick(event)}
    >
      {editing ? (
        <input
          ref={divRef}
          type="checkbox"
          checked={localValue}
          className={classNames(
            'accent-royal-blue dark:accent-orange-400 w-3 h-3 dark:bg-outer-space dark:min-h-0 dark:min-w-0 dark:h-[13px] dark:w-[13px]',
            {
              'dark:appearance-none dark:text-manatee dark:border dark:rounded-[3px]':
                !localValue,
            }
          )}
          onChange={(e) => setLocalValue(e.target.checked)}
        />
      ) : (
        <p>{info.getValue() ? <span className="font-serif">✓</span> : ''}</p>
      )}
    </div>
  );
};

export default EditableCheckBoxInput;
