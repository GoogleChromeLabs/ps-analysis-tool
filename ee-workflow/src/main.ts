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
import Animator from './components/animator';

class Main {
  p5: p5;
  stepsQueue: Figure[] = [];
  groupStepsQueue: Group[] = [];
  animatorStepsQueue: Animator[] = [];
  instantQueue: Figure[] = [];
  groupInstantQueue: Group[] = [];
  animatorInstantQueue: Animator[] = [];
  delay = 100;
  pause = false;
  snapshot: Figure[] = [];
  groupSnapshot: Group[] = [];
  animatorSnapshot: Animator[] = [];
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

  private processGroup(
    queue: Figure[],
    groupQueue: Group[],
    shouldDraw = true
  ) {
    const group = groupQueue.shift();

    if (group) {
      if (shouldDraw) {
        group.draw();
      }

      let toRemoveCount = group.figures.length - 1;
      while (toRemoveCount > 0) {
        queue.shift();
        toRemoveCount--;
      }

      if (!group.throw) {
        group.figures.forEach((object) => this.saveToSnapshot(object));
        this.groupSnapshot.push(group);
        group.throw = true;
      }
    }
  }

  private runner(useInstantQueue = false) {
    const queue = useInstantQueue ? this.instantQueue : this.stepsQueue;
    const groupQueue = useInstantQueue
      ? this.groupInstantQueue
      : this.groupStepsQueue;
    const animatorQueue = useInstantQueue
      ? this.animatorInstantQueue
      : this.animatorStepsQueue;

    if (queue.length > 0) {
      const firstObject = <Figure>queue.shift();

      if (firstObject.aid) {
        const animator = animatorQueue[0];

        if (animator) {
          const isDone = animator.draw();

          if (firstObject.gid) {
            this.processGroup(queue, groupQueue, false);
          } else {
            if (!firstObject.throw) {
              this.saveToSnapshot(firstObject);
            }
          }

          if (isDone) {
            this.animatorSnapshot.push(animator);
            animatorQueue.shift();
            this.reDrawAll();
          }
        }
      } else if (firstObject.gid) {
        this.processGroup(queue, groupQueue);
      } else {
        firstObject.draw();
        if (!firstObject.throw) {
          this.saveToSnapshot(firstObject);
        }
      }
    }
  }

  private draw() {
    if (this.pause) {
      return;
    }

    if (this.p5.frameCount % this.delay === 0) {
      this.runner();
    }

    while (this.instantQueue.length > 0) {
      this.runner(true);
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

  togglePause() {
    this.pause = !this.pause;
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
      if (!(figure instanceof Animator)) {
        this.instantQueue.push(figure);
      }
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
      this.groupInstantQueue.push(group);
      group.figures.forEach((figure) => this.addFigure(figure, instant));
    } else {
      this.groupStepsQueue.push(group);
      group.figures.forEach((figure) => this.addFigure(figure, instant));
    }
  }

  addAnimator(animator: Animator, instant = false) {
    if (instant) {
      this.animatorInstantQueue.push(animator);
      animator.objects.forEach((object) => {
        if (object instanceof Figure) {
          this.addFigure(object, instant);
        } else {
          this.addGroup(object as Group, instant);
        }
      });
    } else {
      this.animatorStepsQueue.push(animator);
      animator.objects.forEach((object) => {
        if (object instanceof Figure) {
          this.addFigure(object, instant);
        } else {
          this.addGroup(object as Group, instant);
        }
      });
    }
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

  removeAnimator(animator: Animator) {
    let toRemove = <Animator | null>null;

    this.animatorSnapshot = this.animatorSnapshot.filter((a) => {
      if (a.id === animator.id) {
        toRemove = a;
        return false;
      }

      return true;
    });

    toRemove?.objects.forEach((object) => {
      if (object instanceof Figure) {
        this.removeFigure(object);
      } else {
        this.removeGroup(object as Group);
      }
    });
  }
}

export default new Main();
