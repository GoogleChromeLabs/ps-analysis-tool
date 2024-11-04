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
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import { topicsAnimation } from './topicsAnimation';

interface AnimationProps {
  epoch: { datetime: string; website: string; topics: string[] }[];
}

const Animation = ({ epoch }: AnimationProps) => {
  const node = useRef(null);

  useEffect(() => {
    const tAnimation = (p: p5) => {
      topicsAnimation(p, epoch);
    };

    const p = node.current ? new p5(tAnimation, node.current) : null;

    return () => {
      p?.remove();
    };
  }, [epoch]);

  return <div ref={node} className="overflow-auto" />;
};

export default Animation;
