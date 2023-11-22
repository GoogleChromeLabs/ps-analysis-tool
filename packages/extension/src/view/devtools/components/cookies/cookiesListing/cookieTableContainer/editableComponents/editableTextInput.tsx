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
import React, { useCallback, useState, useRef, useEffect, memo } from 'react';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../../../stateProviders/syncCookieStore';
import type { InfoType } from '@ps-analysis-tool/design-system';
import { noop } from '@ps-analysis-tool/common';

interface EditableTextInputProps {
  info: InfoType;
  changedKey: string;
  cookieKey?: string | null;
  rowHighlighter?: (value: boolean, cookieKey: string) => void;
}

const EditableTextInput = ({
  info,
  changedKey,
  cookieKey,
  rowHighlighter = noop,
}: EditableTextInputProps) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localValue, setLocalValue] = useState<string>(info as string);
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
            changedKey,
            localValue,
            changedKey === 'name' ? (info as string) : null
          );

          if (!result) {
            rowHighlighter(true, cookieKey);
            setLocalValue(info as string);
          } else {
            rowHighlighter(false, cookieKey);
          }
        }
      }
    },
    [localValue, info, cookieKey, modifyCookie, changedKey, rowHighlighter]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setLocalValue(event.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event?.key === 'Enter') {
        setEditing(false);
        if (localValue !== info && cookieKey) {
          const result = await modifyCookie(
            cookieKey,
            changedKey,
            localValue,
            changedKey === 'name' ? (info as string) : null
          );

          if (!result) {
            rowHighlighter(true, cookieKey);
            setLocalValue(info as string);
          } else {
            rowHighlighter(false, cookieKey);
          }
        }
      }
      if (event?.key === 'Escape') {
        setEditing(false);
      }
    },
    [changedKey, cookieKey, info, localValue, modifyCookie, rowHighlighter]
  );

  useEffect(() => {
    setLocalValue(info as string);
  }, [info]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className={`${!info ? 'w-full h-full' : ''}`}
      onClick={(event) => handleDoubleClick(event)}
    >
      {editing ? (
        <input
          name={changedKey}
          ref={inputRef}
          type="text"
          className="outline-none dark:bg-charleston-green border-[1px] border-gainsboro dark:border-quartz focus:border-royal-blue focus:dark:border-medium-persian-blue dark:text-bright-gray text-outer-space-crayola"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p className="w-full">{info}</p>
      )}
    </div>
  );
};

export default memo(EditableTextInput);
