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

/**
 * Internal dependencies.
 */
import Tree from './tree';
import SearchDropdown from './searchDropdown';

const taxonomyUrl =
  'https://raw.githubusercontent.com/patcg-individual-drafts/topics/refs/heads/main/taxonomy_v2.md';

const loadTaxonomy = async () => {
  const response = await fetch(taxonomyUrl);
  const taxonomy = await response.text();
  return taxonomy;
};

const TaxonomyTree = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [taxonomyArray, setTaxonomyArray] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const taxonomy = await loadTaxonomy();
      const lines = taxonomy.trim().split('\n').slice(2);
      const _taxonomyArray = lines.map((line) => line.split('|')[2].trim());

      setTaxonomyArray(_taxonomyArray);

      const treeConfig = {
        width: 2000,
      };

      const chart = await Tree(taxonomy, treeConfig);

      if (divRef.current) {
        divRef.current.appendChild(chart);
      }
    })();
  }, []);

  const nodeClickHandler = useCallback((value: string) => {
    const clicker = (id: string) => {
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

        setTimeout(() => {
          svgGroup.style.fill = '';
          svgGroup.style.fontWeight = '';
          svgGroup.style.transition = '';
        }, 3000);
      }
    };

    const nodeIds = value.split('/');

    nodeIds.forEach((id) => {
      clicker(id.trim().split(' ').join(''));
    });
  }, []);

  return (
    <>
      <SearchDropdown values={taxonomyArray} onSelect={nodeClickHandler} />
      <div ref={divRef} />
    </>
  );
};

export default TaxonomyTree;
