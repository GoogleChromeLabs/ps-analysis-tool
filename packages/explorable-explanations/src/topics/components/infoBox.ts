/*
 * Copyright 2025 Google LLC
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
 * External dependencies
 */
import p5 from 'p5';

/**
 * Internal dependencies
 */
import { getAdtechsColors } from '../utils';

type InfoBox = {
  p: p5;
  position: { x: number; y: number };
  diameter: number;
  topics: string[];
  adTechs: string[];
};

const infoBox = ({ p, position, diameter, topics, adTechs }: InfoBox) => {
  p.push();
  p.rectMode(p.CENTER);
  p.fill(245);
  p.stroke(0);
  p.strokeWeight(1);
  p.rect(position.x, position.y + diameter / 2 + 150, 280, 200, 10, 10, 10, 10);

  p.stroke(255);
  p.strokeWeight(1);
  p.fill(0);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.textStyle(p.BOLD);
  p.text(
    'Topic(s) Observed:',
    position.x - 120,
    position.y + diameter / 2 + 75
  );
  p.textStyle(p.NORMAL);
  topics.forEach((topic, i) => {
    const _topic = topic.split('/').slice(-1)[0];
    p.text(_topic, position.x - 115, position.y + diameter / 2 + 95 + i * 20);
  });

  const startingPointAdTechs = topics.length * 20 + 20;

  const numAdTechs = adTechs.length;

  p.textStyle(p.BOLD);
  p.text(
    'Observed-by Context Domain(s):',
    position.x - 120,
    position.y + diameter / 2 + 85 + startingPointAdTechs
  );
  p.textStyle(p.NORMAL);
  for (let i = 0; i < numAdTechs; i++) {
    const adTech = adTechs[i];
    const adTechColor = getAdtechsColors(p)[adTech];

    p.fill(adTechColor);
    p.stroke(0);
    p.circle(
      position.x - 110,
      position.y + diameter / 2 + 105 + i * 20 + startingPointAdTechs,
      diameter / 5
    );

    p.fill(0);
    p.stroke(255);
    p.text(
      adTech,
      position.x - 85,
      position.y + diameter / 2 + 105 + i * 20 + startingPointAdTechs
    );
  }

  p.stroke(0);
  p.line(
    position.x,
    position.y + diameter / 2 + 1,
    position.x,
    position.y + 75
  );

  p.pop();
};

export default infoBox;
