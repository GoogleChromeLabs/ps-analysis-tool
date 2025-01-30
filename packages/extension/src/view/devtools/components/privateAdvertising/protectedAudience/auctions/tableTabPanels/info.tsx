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

interface InfoProps {
  data: {
    title: string;
    info: string;
  } | null;
}

const Info = ({ data }: InfoProps) => {
  return (
    <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow h-full w-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
      {data?.info ? (
        <div className="p-2">
          <h3 className="text-sm font-medium">{data?.title}</h3>
          <div className="text-[12.5px] mt-1">{data?.info}</div>
        </div>
      ) : (
        <div className="h-full box-border p-8 flex items-center">
          <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
            No information available
          </p>
        </div>
      )}
    </div>
  );
};

export default Info;
