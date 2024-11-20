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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLinkBlack } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Tree from './tree';
import SearchDropdown from './searchDropdown';

const loadTaxonomy = async (taxonomyUrl: string) => {
  const response = await fetch(taxonomyUrl);
  const taxonomy = await response.text();
  return taxonomy;
};

interface TaxonomyTreeProps {
  taxonomyUrl: string;
  githubUrl: string;
}

const TaxonomyTree = ({ taxonomyUrl, githubUrl }: TaxonomyTreeProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [taxonomyArray, setTaxonomyArray] = useState<string[]>([]);

  useEffect(() => {
    const divContainer = divRef.current;

    (async () => {
      const taxonomy = await loadTaxonomy(taxonomyUrl);
      const lines = taxonomy.trim().split('\n').slice(2);
      const _taxonomyArray = lines.map((line) => line.split('|')[2].trim());

      setTaxonomyArray(_taxonomyArray);

      const treeConfig = {
        width: 2000,
      };

      const chart = await Tree(taxonomy, treeConfig);

      if (divContainer) {
        divContainer.appendChild(chart);
      }
    })();

    return () => {
      if (divContainer) {
        divContainer.innerHTML = '';
      }
    };
  }, [taxonomyUrl]);

  const nodeClickHandler = useCallback((value: string) => {
    const clicker = (id: string, nextId?: string) => {
      if (nextId && document.getElementById(nextId)) {
        return;
      }

      const svgGroup = document.getElementById(id);

      if (svgGroup) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });

        svgGroup.dispatchEvent(clickEvent);

        svgGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });

        svgGroup.style.fill = 'orangered';
        svgGroup.style.transition = 'fill 1s';

        timeoutRef.current = setTimeout(() => {
          svgGroup.style.fill = '';
          svgGroup.style.fontWeight = '';
          svgGroup.style.transition = '';
        }, 3000);
      }
    };

    const nodeIds = value.split('/');

    nodeIds.forEach((id, idx) => {
      const _id = id.trim().split(' ').join('');
      const nextId = nodeIds[idx + 1]?.trim().split(' ').join('');

      clicker(_id, nextId);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <SearchDropdown values={taxonomyArray} onSelect={nodeClickHandler} />
      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute right-2 top-0"
        title="View on GitHub"
      >
        <ExternalLinkBlack
          className="fill-current text-black dark:text-bright-gray group-hover:text-blue-500"
          width="14"
        />
      </a>
      <div className="p-4" ref={divRef} />
    </div>
  );
};

export default TaxonomyTree;