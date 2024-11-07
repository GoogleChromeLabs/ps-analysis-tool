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
import React, { useEffect, useRef, useState } from 'react';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import { PaddedCross } from '../../icons';

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  placeholder?: string;
}

const SearchInput = ({
  value,
  onChange,
  clearInput,
  placeholder,
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (inputContainerRef.current) {
        const isClickInside = inputContainerRef.current.contains(
          event.target as Node
        );

        if (!isClickInside) {
          setIsFocused(false);
        } else {
          setIsFocused(true);
          inputRef.current?.focus();
        }
      }
    };

    globalThis?.document?.addEventListener('click', handleClick);

    return () => {
      globalThis?.document?.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={inputContainerRef}
      className={`w-3/5 cursor-text bg-white dark:bg-charleston-green text-raisin-black dark:text-bright-gray border rounded flex justify-between items-center gap-1 mx-[3px] my-px px-[3px] pt-0.5 pb-px box-content text-xs ${
        isFocused
          ? 'border-sapphire dark:border-baby-blue-eyes'
          : 'border-chinese-silver dark:border-davys-grey hover:bg-eerie-black dark:hover:bg-outer-space'
      }`}
    >
      <input
        ref={inputRef}
        type="text"
        className="h-[14px] w-full outline-none bg-transparent"
        placeholder={placeholder || I18n.getMessage('search')}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
      />

      <button
        onClick={clearInput}
        className={`w-fit h-3 px-px scale-[1.6] hover:opacity-70 active:opacity-50 flex justify-center items-center ${
          value ? 'visible' : 'invisible'
        }`}
        title={I18n.getMessage('clearSearch')}
      >
        <PaddedCross />
      </button>
    </div>
  );
};

export default SearchInput;
