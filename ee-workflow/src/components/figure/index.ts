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

import p5 from 'p5';
import main from '../../main';

export default abstract class Figure {
  p5: p5 | null = null;
  uid = '';
  x = 0;
  y = 0;
  fill = 'black';
  stroke = 'black';
  previousFill = '';
  previousStroke = '';
  throw?: boolean; // Property to determine if the object should be added to the snapshot

  static objectCount = 0;

  constructor(x: number, y: number, fill?: string, stroke?: string) {
    Figure.objectCount++;
    this.uid =
      `object-${Figure.objectCount}` + Math.random().toString(36).slice(2, 9);
    this.p5 = main.getP5Instance();
    this.x = x;
    this.y = y;
    this.fill = fill || 'black';
    this.stroke = stroke || 'black';
    this.previousFill = this.fill;
    this.previousStroke = this.stroke;
  }

  abstract draw(): void;

  abstract onHover(): void;

  abstract onLeave(): void;

  abstract onClick(): void;

  abstract isHovering(): boolean;

  abstract remove(): void;

  savePreviousColors() {
    if (this.previousFill === this.fill) {
      this.previousFill = this.fill;
    }

    if (this.previousStroke === this.stroke) {
      this.previousStroke = this.stroke;
    }
  }

  reApplyPreviousColors() {
    this.fill = this.previousFill;
    this.previousFill = this.fill;
    this.stroke = this.previousStroke;
    this.previousStroke = this.stroke;
  }
}
