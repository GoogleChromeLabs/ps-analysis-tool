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
  const lastClickedNodeId = useRef<string | null>(null);

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  const highlightNode = useCallback((id: string) => {
    const svgGroup = document.getElementById(id);

    if (svgGroup) {
      svgGroup.style.fill = 'orangered';
      svgGroup.style.transition = 'fill 1s';
    }
  }, []);

  const unHighlightLastClickedNode = useCallback(() => {
    const ids = lastClickedNodeId.current?.split('/');

    ids?.forEach((id) => {
      const svgGroup = document.getElementById(id.trim().split(' ').join(''));

      if (svgGroup) {
        svgGroup.style.fill = '';
        svgGroup.style.transition = 'fill 1s';
      }
    });
  }, []);

  const buildNodePathAndHighlight = useCallback(
    (nodeData: any) => {
      const path: string[] = [];

      const builder = (_nodeData: any) => {
        const nodeName = _nodeData.data.name;

        if (nodeName) {
          path.unshift(nodeName);
          builder(_nodeData.parent);
        }
      };

      builder(nodeData);

      unHighlightLastClickedNode();
      lastClickedNodeId.current = path.join('/');
      setStorage(
        JSON.stringify({
          taxonomy: lastClickedNodeId.current,
        }),
        2
      );

      path.forEach((id) => {
        highlightNode(id.split(' ').join(''));
      });
    },
    [highlightNode, setStorage, unHighlightLastClickedNode]
  );

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

      if (!nextId) {
        const circle = document.getElementById(_id)?.querySelector('circle');
        circle?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, []);

  const storageRef = useRef(storage);

  useEffect(() => {
    storageRef.current = storage;
  }, [storage]);

  useEffect(() => {
    return () => {
      setStorage(
        JSON.stringify({
          taxonomy: '',
        }),
        2
      );
    };
    // Keep this effect empty to only make storage empty only on unmount, not active tab change
  }, []);

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

      const chart = await Tree(taxonomy, treeConfig, buildNodePathAndHighlight);

      if (divContainer && chart) {
        divContainer.appendChild(chart);
      }

      if (storageRef.current[2]) {
        const data = JSON.parse(storageRef.current[2] || '{}');
        const topic = data?.taxonomy;

        if (!topic) {
          return;
        }

        const timeout = setTimeout(() => {
          nodeClickHandler(topic);
        }, 200);

        timeoutRef.current.push(timeout);
      }
    })();

    return () => {
      if (divContainer) {
        divContainer.innerHTML = '';
      }
    };
  }, [buildNodePathAndHighlight, nodeClickHandler, setStorage, taxonomyUrl]);

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
