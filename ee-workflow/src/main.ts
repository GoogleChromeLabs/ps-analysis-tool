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
  backgroundColor = 245;

  constructor() {
    this.p5 = new p5(this.init.bind(this));
  }

  private init(p: p5) {
    p.setup = this.setUp.bind(this);
    p.draw = this.draw.bind(this);
    p.mouseMoved = this.onHover.bind(this);
    p.mouseClicked = this.onClick.bind(this);
  }

  private setUp() {
    this.p5.createCanvas(1600, 1600);
    this.p5.background(this.backgroundColor);
  }

  private draw() {
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
        firstObject.throw = true;
      }
    }

    if (this.instantQueue.length > 0) {
      this.instantQueue.forEach((object) => {
        object.draw();

        if (!object.throw) {
          this.snapshot.push(object);
          object.throw = true;
        }
      });
      this.instantQueue = [];
    }
  }

  private onHover() {
    this.snapshot.forEach((object) => {
      if (object.isHovering()) {
        object.onHover();
      } else {
        object.onLeave();
      }
    });
  }

  private onClick() {
    this.snapshot.forEach((object) => {
      if (object.isHovering()) {
        object.onClick();
      }
    });
  }

  getP5Instance() {
    return this.p5;
  }

  reDrawAll() {
    if (this.pause) {
      return;
    }

    this.p5.clear();
    this.p5.background(this.backgroundColor);
    this.stepsQueue = [];
    this.instantQueue = [];
    this.snapshot.forEach((figure) => {
      this.instantQueue.push(figure);
    });
  }

  addFigure(figure: Figure, instant = false) {
    if (instant) {
      this.instantQueue.push(figure);
    } else {
      this.stepsQueue.push(figure);
    }
  }

  togglePause() {
    this.pause = !this.pause;
  }

  removeFigure(figure: Figure) {
    this.snapshot = this.snapshot.filter((f) => f.uid !== figure.uid);
    this.reDrawAll();
  }
}

export default new Main();
