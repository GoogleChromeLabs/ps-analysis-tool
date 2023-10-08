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

/**
 * Internal dependencies.
 */
import ListRow from './listRow';

type BulletListProps = {
  rows: BulletListItem[];
  heading?: string;
};

const BulletList = ({ rows, heading }: BulletListProps) => {
  return (
    <>
      {heading && (
        <>
          <h2 className="text-xs font-bold uppercase text-darkest-gray dark:text-bright-gray">
            {heading}
          </h2>
          <hr className="border-0 border-b border-hex-gray dark:border-quartz" />
        </>
      )}
      <div className="space-y-4">
        {rows.map((rowItem) => (
          <ListRow row={rowItem} key={rowItem?.key ?? rowItem.title} />
        ))}
      </div>
    </>
  );
};

export default BulletList;
