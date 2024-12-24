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
import Group from './components/group';

class Main {
  p5: p5;
  stepsQueue: Figure[] = [];
  groupStepsQueue: Group[] = [];
  instantQueue: Figure[] = [];
  delay = 50;
  pause = false;
  snapshot: Figure[] = [];
  groupSnapshot: Group[] = [];
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

  private saveToSnapshot(object: Figure) {
    this.snapshot.push(object);
    object.throw = true;
  }

  private draw() {
    if (this.pause) {
      return;
    }

    if (this.p5.frameCount % this.delay === 0) {
      if (this.stepsQueue.length > 0) {
        const firstObject = <Figure>this.stepsQueue.shift();

        firstObject.draw();
        if (!firstObject.throw) {
          this.saveToSnapshot(firstObject);
        }
      }

      if (this.groupStepsQueue.length > 0) {
        const firstGroup = <Group>this.groupStepsQueue.shift();

        firstGroup.draw();
        if (!firstGroup.throw) {
          firstGroup.figures.forEach((object) => this.saveToSnapshot(object));

          this.groupSnapshot.push(firstGroup);
          firstGroup.throw = true;
        }
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

  private isGrouped(object: Figure): Group | undefined {
    if (!object.gid) {
      return undefined;
    }

    return this.groupSnapshot.find((group) => group.id === object.gid);
  }

  private onHover() {
    this.snapshot.forEach((object) => {
      const isHovering = object.isHovering();
      const _object = this.isGrouped(object) || object;

      if (isHovering) {
        _object.onHover();
      } else {
        _object.onLeave();
      }
    });
  }

  private onClick() {
    this.snapshot.forEach((object) => {
      const isHovering = object.isHovering();
      if (isHovering) {
        const _object = this.isGrouped(object) || object;

        _object.onClick();
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

  addGroup(group: Group, instant = false) {
    if (instant) {
      group.figures.forEach((figure) => this.instantQueue.push(figure));
    } else {
      this.groupStepsQueue.push(group);
    }
  }

  togglePause() {
    this.pause = !this.pause;
  }

  removeFigure(figure: Figure) {
    this.snapshot = this.snapshot.filter((f) => f.id !== figure.id);
    this.reDrawAll();
  }

  removeGroup(group: Group) {
    let toRemove = <Group | null>null;

    this.groupSnapshot = this.groupSnapshot.filter((g) => {
      if (g.id === group.id) {
        toRemove = g;
        return false;
      }

      return true;
    });

    toRemove?.figures.forEach((g) => this.removeFigure(g));
  }
}

export default new Main();
