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

interface EditableTextInputProps {
  info: InfoType;
  changedKey: string;
  cookieKey?: string | null;
}

const EditableTextInput = ({
  info,
  changedKey,
  cookieKey,
}: EditableTextInputProps) => {
  const [editing, setEditing] = useState(false);
  const divRef = useRef<HTMLInputElement>(null);

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
      divRef.current?.focus();
    }
  }, [editing]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setEditing(false);
        if (localValue && localValue !== info && cookieKey) {
          modifyCookie(
            cookieKey,
            changedKey,
            localValue,
            changedKey === 'name' ? (info as string) : null
          );
        }
      }
    },
    [info, changedKey, localValue, modifyCookie, cookieKey]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setLocalValue(event.target.value);
    },
    []
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div onClick={(event) => handleDoubleClick(event)}>
      {editing ? (
        <input
          name={changedKey}
          ref={divRef}
          type="text"
          className="mx-2 outline-none dark:bg-charleston-green border-[1px] border-gainsboro dark:border-quartz focus:border-royal-blue focus:dark:border-medium-persian-blue dark:text-bright-gray text-outer-space-crayola"
          value={localValue}
          onChange={handleChange}
        />
      ) : (
        <p>{info}</p>
      )}
    </div>
  );
};

export default memo(EditableTextInput);
