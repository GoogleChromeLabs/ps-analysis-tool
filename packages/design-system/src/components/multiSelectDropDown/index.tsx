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
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
/**
 * Internal dependencies
 */
import { ArrowDown } from '../../icons';
import { Option } from '../dropdown/options';

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  specialValue?: string;
}

const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder = 'Default levels',
  specialValue = options[0].value,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [startAnimation, setStartAnimation] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    setStartAnimation(true);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(!isOpen);
      setStartAnimation(false);
    }, 100);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
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
      return placeholder;
    } else {
      if (selected.includes(specialValue)) {
        return 'All levels';
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
  }, [options, placeholder, selected, specialValue]);

  return (
    <div className="relative inline-block text-left text-sm" ref={dropdownRef}>
      <button
        type="button"
        className="gap-1 inline-flex items-center px-1 rounded-md dark:bg-raisin-black text-raisin-black dark:text-bright-gray"
        onClick={(event) => {
          setIsOpen((prev) => !prev);
          setPosition({ x: event.clientX, y: event.clientY });
        }}
      >
        {labelToDisplay}
        <ArrowDown />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={wrapperRef}
            className={classNames(
              'transition duration-100',
              startAnimation ? 'opacity-0' : 'opacity-100'
            )}
            data-testid="column-menu"
          >
            <div
              className="absolute z-[100] text-raisin-black dark:text-bright-gray rounded-md backdrop-blur-2xl w-screen max-w-[13rem] p-1.5 mr-2 divide-y divide-neutral-300 dark:divide-neutral-500 max-h-[78vh] overflow-auto bg-stone-200 dark:bg-neutral-700 shadow-3xl"
              style={{
                left: 'min( calc( 100vw - 15rem),' + position.x + 'px )',
                top: position.y + 'px',
                border: '0.5px solid rgba(0, 0, 0, 0.20)',
              }}
            >
              <div>
                <ul>
                  {options.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => toggleOption(option.value)}
                    >
                      <button
                        className="w-full text-xs rounded px-1 py-[3px] mb-1.5 flex items-center hover:bg-blueberry hover:text-white cursor-default"
                        onClick={() => {
                          toggleOption(option.value);
                          handleClose();
                        }}
                      >
                        <span
                          className={classNames(
                            'mr-2 font-semibold',
                            selected.includes(option.value)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        >
                          ✓
                        </span>
                        <span>{option.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              data-testid="column-menu-overlay"
              onClick={handleClose}
              className="absolute w-screen h-screen z-10 top-0 left-0"
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default MultiSelectDropdown;
