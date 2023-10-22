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
import React from 'react';

interface HeaderResizerProps {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const HeaderResizer = ({ onMouseDown }: HeaderResizerProps) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="cursor-col-resize absolute right-0 top-0 w-2 h-full active:bg-slate-200 dark:active:bg-slate-800"
    />
  );
};

export default HeaderResizer;
