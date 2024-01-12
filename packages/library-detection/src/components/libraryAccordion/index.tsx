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
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Ellipse } from '@ps-analysis-tool/design-system';

const LibraryAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border-t border-b border-hex-gray flex py-2 cursor-pointer hover:bg-slate-100 transition-all"
      >
        <span className="flex items-center px-2">
          <Ellipse />
        </span>
        <p className="flex-1">Google Sign-In: detecting...</p>
        <span className="flex items-center px-2">
          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </span>
      </div>
      {isOpen && <div className="p-5">Content</div>}
    </div>
  );
};

export default LibraryAccordion;
