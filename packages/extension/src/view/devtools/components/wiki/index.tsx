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
import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import 'github-markdown-css';

const Wiki = () => {
  const [html, setHTML] = useState<string>('');

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/wiki/GoogleChromeLabs/ps-analysis-tool/Home.md'
      );
      const _markdown = await response.text();
      const _html = await marked.parse(_markdown);

      setHTML(_html);
    })();
  }, []);

  return (
    <div className="p-5 pb-10">
      <div className="markdown-body h-full w-full">
        <h2>Wiki</h2>
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
      </div>
    </div>
  );
};

export default Wiki;
