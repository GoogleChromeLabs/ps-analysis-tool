/*
 * Copyright 2024 Google LLC
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

/**
 * Internal dependencies.
 */
import { SupportIcon, ExternalLinkBlack } from '../../icons';

const SupportLink = () => {
  return (
    <a
      className="group dark:text-bright-gray flex items-center hover:text-blue-500 hover:dark:text-blue-400"
      target="_blank"
      href="https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions/categories/support-forum"
      rel="noreferrer"
    >
      <span className="mt-[1px] mr-1">
        <SupportIcon
          width="18"
          className="fill-current text-black dark:text-bright-gray group-hover:text-blue-500"
        />
      </span>
      <span>Support Forum</span>
      <span className="ml-[2px] inline-block">
        <ExternalLinkBlack
          className="fill-current text-black dark:text-bright-gray group-hover:text-blue-500"
          width="14"
        />
      </span>
    </a>
  );
};

export default SupportLink;
