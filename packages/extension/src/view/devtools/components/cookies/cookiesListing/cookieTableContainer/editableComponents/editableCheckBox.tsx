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
import React, { useCallback, useState, useRef, useEffect } from 'react';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../../../stateProviders/syncCookieStore';
import classNames from 'classnames';
import type { InfoType } from '@ps-analysis-tool/design-system';
import { noop } from '@ps-analysis-tool/common';

interface EditableCheckBoxInputProps {
  info: InfoType;
  keyToChange: string;
  cookieKey?: string | null;
  rowHighlighter?: (value: boolean, cookieKey: string) => void;
}

const EditableCheckBoxInput = ({
  info,
  keyToChange,
  cookieKey,
  rowHighlighter = noop,
}: EditableCheckBoxInputProps) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localValue, setLocalValue] = useState<boolean>(info as boolean);
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

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleClickOutside = useCallback(
    async (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setEditing(false);
        if (localValue !== info && cookieKey) {
          const result = await modifyCookie(
            cookieKey,
            keyToChange,
            localValue,
            null
          );
          if (!result) {
            rowHighlighter(true, cookieKey);
            setLocalValue(info as boolean);
          }
        }
      }
    },
    [info, keyToChange, localValue, modifyCookie, cookieKey, rowHighlighter]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    setLocalValue(info as boolean);
    setEditing(false);
  }, [info]);

  return (
    <div
      className="h-full w-full flex items-center justify-center"
      onClick={(event) => handleDoubleClick(event)}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {editing ? (
        <input
          ref={inputRef}
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
        <p>{info ? <span className="font-serif">✓</span> : ''}</p>
      )}
    </div>
  );
};

export default EditableCheckBoxInput;
