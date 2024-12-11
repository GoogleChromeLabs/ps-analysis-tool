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
import { ExternalLinkBlack, useTabs } from '@google-psat/design-system';

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [taxonomyArray, setTaxonomyArray] = useState<string[]>([]);

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  const nodeClickHandler = useCallback((value: string) => {
    const clicker = (id: string, nextId?: string) => {
      const shouldClick = Boolean(!(nextId && document.getElementById(nextId)));

      const svgGroup = document.getElementById(id);

      if (svgGroup) {
        if (shouldClick) {
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
          });

          svgGroup.dispatchEvent(clickEvent);
        }

        svgGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        svgGroup.style.fill = 'orangered';
        svgGroup.style.transition = 'fill 1s';

        const timeout = setTimeout(() => {
          svgGroup.style.fill = '';
          svgGroup.style.fontWeight = '';
          svgGroup.style.transition = '';
        }, 3000);

        timeoutRef.current.push(timeout);
      }
    };

    const nodeIds = value.split('/');

    nodeIds.forEach((id, idx) => {
      const _id = id.trim().split(' ').join('');
      const nextId = nodeIds[idx + 1]?.trim().split(' ').join('');

      if (idx !== 0 && _id === '') {
        return;
      }

      clicker(_id || 'tax-tree-root-node', nextId); // if no id is provided it's the root of the tree
    });
  }, []);

  const storageRef = useRef(storage);

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

      if (storageRef.current[1]) {
        const data = JSON.parse(storageRef.current[1] || '{}');
        const topic = data?.taxonomy;

        if (!topic) {
          return;
        }

        nodeClickHandler(topic);
        setStorage(
          JSON.stringify({
            taxonomy: '',
          }),
          1
        );
      }
    })();

    return () => {
      if (divContainer) {
        divContainer.innerHTML = '';
      }
    };
  }, [nodeClickHandler, setStorage, taxonomyUrl]);

  useEffect(() => {
    const timeouts = timeoutRef.current;

    return () => {
      if (timeouts) {
        timeouts.forEach((timeout) => {
          clearTimeout(timeout);
        });
      }
    };
  }, []);

  return (
    <div className="relative h-full flex flex-col">
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
      <div className="m-4 overflow-auto bg-white" ref={divRef} />
    </div>
  );
};

export default TaxonomyTree;
