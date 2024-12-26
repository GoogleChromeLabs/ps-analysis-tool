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
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import Figure from './components/figure';
import Group from './components/group';
import Animator from './components/animator';

/**
 * Main class responsible for managing the rendering and interaction of figures,
 * groups, and animators using p5.js.
 */
class Main {
  /**
   * p5 instance for rendering.
   */
  p5: p5;

  /**
   * Queue for steps to be processed.
   */
  stepsQueue: Figure[] = [];

  /**
   * Queue for group steps to be processed.
   */
  groupStepsQueue: Group[] = [];

  /**
   * Queue for animator steps to be processed.
   */
  animatorStepsQueue: Animator[] = [];

  /**
   * Queue for instant steps to be processed.
   */
  instantQueue: Figure[] = [];

  /**
   * Queue for instant group steps to be processed.
   */
  groupInstantQueue: Group[] = [];

  /**
   * Queue for instant animator steps to be processed.
   */
  animatorInstantQueue: Animator[] = [];

  /**
   * Delay between each frame in milliseconds.
   */
  delay = 50;

  /**
   * Flag to pause the drawing process.
   */
  pause = false;

  /**
   * Snapshot of figures that have been drawn.
   */
  snapshot: Figure[] = [];

  /**
   * Snapshot of groups that have been drawn.
   */
  groupSnapshot: Group[] = [];

  /**
   * Snapshot of animators that have been drawn.
   */
  animatorSnapshot: Animator[] = [];

  /**
   * Background color of the canvas.
   */
  backgroundColor = 245;

  /**
   * Creates an instance of Main and initializes the p5 instance.
   */
  constructor() {
    this.p5 = new p5(this.init.bind(this));
  }

  /**
   * Initialize.
   * @param p - The p5 instance.
   */
  private init(p: p5) {
    p.setup = this.setUp.bind(this);
    p.draw = this.draw.bind(this);
    p.mouseMoved = this.onHover.bind(this);
    p.mouseClicked = this.onClick.bind(this);
  }

  /**
   * Sets up the canvas.
   */
  private setUp() {
    this.p5.createCanvas(1600, 1600);
    this.p5.background(this.backgroundColor);
  }

  /**
   * Saves a figure to the snapshot and marks it as thrown.
   * @param object - The figure to save.
   */
  private saveToSnapshot(object: Figure) {
    this.snapshot.push(object);
    object.throw = true;
  }

  /**
   * Processes a group of figures, drawing them and saving to snapshot if necessary.
   * @param queue - The queue of figures.
   * @param groupQueue - The queue of groups.
   * @param shouldDraw - Whether to draw the group.
   */
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

  /**
   * Runs the drawing process for the current queue.
   * @param useInstantQueue - Whether to use the instant queue.
   */
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

  /**
   * Draws the current frame, processing the queues.
   */
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

  /**
   * Checks if a figure is part of a group.
   * @param object - The figure to check.
   * @returns The group the figure belongs to, or undefined.
   */
  private isGrouped(object: Figure): Group | undefined {
    if (!object.gid) {
      return undefined;
    }

    return this.groupSnapshot.find((group) => group.id === object.gid);
  }

  /**
   * Handles hover events for figures.
   */
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

  /**
   * Handles click events for figures.
   */
  private onClick() {
    this.snapshot.forEach((object) => {
      const isHovering = object.isHovering();
      if (isHovering) {
        const _object = this.isGrouped(object) || object;

        _object.onClick();
      }
    });
  }

  /**
   * Gets the p5 instance.
   * @returns The p5 instance.
   */
  getP5Instance() {
    return this.p5;
  }

  /**
   * Toggles the pause state.
   */
  togglePause() {
    this.pause = !this.pause;
  }

  /**
   * Resets the queues and redraws all figures on the canvas.
   */
  resetAndReDrawAll() {
    if (this.pause) {
      return;
    }

    this.stepsQueue = [];
    this.instantQueue = [];
    this.groupStepsQueue = [];
    this.groupInstantQueue = [];
    this.animatorStepsQueue = [];
    this.animatorInstantQueue = [];
    this.reDrawAll();
  }

  /**
   * Redraws all figures on the canvas.
   * @param animatorIdToDraw - The ID of the animator to draw.
   */
  reDrawAll(animatorIdToDraw?: string) {
    if (this.pause) {
      return;
    }

    this.p5.clear();
    this.p5.background(this.backgroundColor);
    for (let i = 0; i < this.snapshot.length; i++) {
      const figure = this.snapshot[i];

      if (figure.aid) {
        const animator = this.animatorSnapshot.find((a) => a.id === figure.aid);

        if (animator && animatorIdToDraw === animator.id) {
          this.addAnimator(animator, true);
        }

        const toRemoveCount =
          animator?.objects.reduce((acc, object) => {
            if (object instanceof Figure) {
              acc++;
            } else {
              acc += object.figures.length;
            }

            return acc;
          }, 0) || 1;

        i += toRemoveCount - 1;
      } else if (figure.gid) {
        const group = this.groupSnapshot.find((g) => g.id === figure.gid);

        if (group) {
          this.addGroup(group, true);
        }

        const toRemoveCount = (group?.figures.length || 1) - 1;
        i += toRemoveCount;
      } else {
        this.addFigure(figure, true);
      }
    }
  }

  /**
   * Adds a figure to the queue.
   * @param figure - The figure to add.
   * @param instant - Whether to add to the instant queue.
   */
  addFigure(figure: Figure, instant = false) {
    if (instant) {
      this.instantQueue.push(figure);
    } else {
      this.stepsQueue.push(figure);
    }
  }

  /**
   * Adds a group to the queue.
   * @param group - The group to add.
   * @param instant - Whether to add to the instant queue.
   */
  addGroup(group: Group, instant = false) {
    if (instant) {
      this.groupInstantQueue.push(group);
      group.figures.forEach((figure) => this.addFigure(figure, instant));
    } else {
      this.groupStepsQueue.push(group);
      group.figures.forEach((figure) => this.addFigure(figure, instant));
    }
  }

  /**
   * Adds an animator to the queue.
   * @param animator - The animator to add.
   * @param instant - Whether to add to the instant queue.
   */
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

  /**
   * Removes a figure from the snapshot.
   * @param figure - The figure to remove.
   */
  removeFigure(figure: Figure) {
    this.snapshot = this.snapshot.filter((f) => f.id !== figure.id);
    this.reDrawAll();
  }

  /**
   * Removes a group from the snapshot.
   * @param group - The group to remove.
   */
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

  /**
   * Removes an animator from the snapshot.
   * @param animator - The animator to remove.
   */
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
