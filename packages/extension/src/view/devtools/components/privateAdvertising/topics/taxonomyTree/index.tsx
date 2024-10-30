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
import React, { useEffect, useRef } from 'react';
import Tree from './tree';

const taxonomyUrl =
  'https://raw.githubusercontent.com/patcg-individual-drafts/topics/refs/heads/main/taxonomy_v2.md';

const loadTaxonomy = async () => {
  const response = await fetch(taxonomyUrl);
  const taxonomy = await response.text();
  return taxonomy;
};

const TaxonomyTree = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const taxonomy = await loadTaxonomy();
      const treeConfig = {
        width: 2000,
      };

      const chart = await Tree(taxonomy, treeConfig);

      if (divRef.current) {
        divRef.current.appendChild(chart);
      }
    })();
  }, []);

  return (
    <>
      <div ref={divRef} />
    </>
  );
};

export default TaxonomyTree;
