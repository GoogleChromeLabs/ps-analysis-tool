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

interface ContentPanelProps {
  title: string;
  content: { title: string; description: string; url: string }[];
  titleStyles?: string;
  counterStyles?: string;
}

const ContentPanel = ({
  title,
  content,
  titleStyles = '',
  counterStyles = '',
}: ContentPanelProps) => {
  return (
    <div className="px-2">
      <h3 className="text-lg text-raisin-black dark:text-bright-gray mb-7">
        {title}
      </h3>
      <div className="flex gap-5 flex-wrap">
        {content.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="w-72 h-80 bg-[#FDFDFD] hover:bg-[#FAFAFA] rounded-xl border border-bright-gray dark:border-quartz p-5 hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out "
          >
            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-bright-gray mb-5">
              <div
                className={`w-9 h-9 flex justify-center items-center rounded-md ${counterStyles}`}
              >
                <span className="text-xxl text-white dark:black font-extrabold">
                  {index + 1}
                </span>
              </div>
            </div>
            <h3 className={`text-xl mb-5 ${titleStyles}`}>{item.title}</h3>
            <p className="text-base text-raisin-black dark:text-bright-gray">
              {item.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContentPanel;
