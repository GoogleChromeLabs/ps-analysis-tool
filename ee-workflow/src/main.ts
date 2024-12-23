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
import Figure from './components/figure';

class Main {
  p5: p5;
  stepsQueue: Figure[] = [];
  instantQueue: Figure[] = [];
  delay = 50;
  pause = false;
  snapshot: Figure[] = [];

  constructor() {
    this.p5 = new p5(this.init);
  }

  private init = (p: p5) => {
    p.setup = this.setUp;
    p.draw = this.draw;
  };

  private setUp = () => {
    this.p5.createCanvas(1600, 1600);
    this.p5.background(245);
  };

  private draw = () => {
    if (this.pause) {
      return;
    }

    if (this.p5.frameCount % this.delay === 0) {
      const firstObject = this.stepsQueue.shift();
      if (firstObject === undefined) {
        return;
      }

      firstObject.draw();
      if (!firstObject.throw) {
        this.snapshot.push(firstObject);
      }
    }

    if (this.instantQueue.length > 0) {
      this.instantQueue.forEach((object) => {
        object.draw();
      });
      this.instantQueue = [];
    }
  };

  reDrawAll = () => {
    if (this.pause) {
      return;
    }

    this.p5.clear();
    this.p5.background(245);
    this.stepsQueue = [];
    this.instantQueue = [];
    this.snapshot.forEach((figure) => {
      this.instantQueue.push(figure);
    });
  };

  addFigure = (figure: Figure, instant = false) => {
    if (instant) {
      this.instantQueue.push(figure);
    } else {
      this.stepsQueue.push(figure);
    }
  };

  togglePause = () => {
    this.pause = !this.pause;
  };
}

export default new Main();
