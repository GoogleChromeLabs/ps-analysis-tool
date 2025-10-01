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
 * External dependencies.
 */
import React from 'react';

const Tooltip = ({ tooltipText }: { tooltipText?: string }) => {
  return (
    <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[110%] bg-black/80 text-white text-xs rounded px-2 py-1 shadow-lg animate-fadeIn z-10 pointer-events-none text-center max-w-xs min-w-[80px] w-max whitespace-pre-line transition-opacity duration-300">
      {tooltipText}
    </div>
  );
};

export default Tooltip;
