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
 * External dependencies
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ConsoleFilterDropdownProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  specialValue?: string;
}

const ConsoleFilterDropdown: React.FC<ConsoleFilterDropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Default levels',
  specialValue = options[0].value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    let newSelected: string[] = [];
    const isSelected = selected.includes(value);

    if (value === 'ALL') {
      newSelected = isSelected ? [] : options.map((o) => o.value);
    } else {
      if (isSelected) {
        newSelected = selected.filter((v) => v !== value);
      } else {
        newSelected = [...selected, value];
      }

      // Automatically select 'all' if all individual options are selected
      const allOption = options.find((o) => o.value === 'ALL');
      const individualOptions = options.filter((o) => o.value !== 'ALL');
      const allSelected = individualOptions.every((opt) =>
        newSelected.includes(opt.value)
      );

      if (allOption) {
        if (allSelected) {
          newSelected = options.map((o) => o.value);
        } else {
          newSelected = newSelected.filter((v) => v !== 'ALL');
        }
      }
    }

    onChange(newSelected);
  };

  const labelToDisplay = useMemo(() => {
    if (selected.length === 0) {
      placeholder;
    } else {
      if (selected.includes(specialValue)) {
        ('All levels');
      } else {
        if (selected.length > 1) {
          return 'Custom levels';
        } else {
          return `${
            options.find((option) => option.value === selected[0])?.label
          } only`;
        }
      }
    }
    return placeholder;
  }, [options, placeholder, selected, specialValue]);

  return (
    <div className="relative inline-block text-left text-sm" ref={dropdownRef}>
      <button
        type="button"
        className="border gap-1 inline-flex items-center px-1 rounded dark:bg-raisin-black text-raisin-black dark:text-bright-gray"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {labelToDisplay}
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 rounded border bg-white dark:bg-raisin-black text-raisin-black dark:text-bright-gray shadow-lg">
          {options.map((option) => (
            <label
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className="flex items-center px-1 py-1 cursor-pointer"
            >
              {selected.includes(option.value) && (
                <span className="mr-1  dark:bg-raisin-black text-raisin-black dark:text-bright-gray">
                  ✓
                </span>
              )}
              <span className=" dark:bg-raisin-black text-raisin-black dark:text-bright-gray">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsoleFilterDropdown;
