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
import Traveller from './components/traveller';

/**
 * Main class responsible for managing the rendering and interaction of figures,
 * groups, and animators using p5.js.
 */
class Main {
  /**
   * p5 instance for rendering.
   */
  private p5: p5;

  /**
   * Queue for steps to be processed.
   */
  private stepsQueue: Figure[] = [];

  /**
   * Queue for group steps to be processed.
   */
  private groupStepsQueue: Group[] = [];

  /**
   * Queue for animator steps to be processed.
   */
  private animatorStepsQueue: Animator[] = [];

  /**
   * Queue for instant steps to be processed.
   */
  private instantQueue: Figure[] = [];

  /**
   * Queue for instant group steps to be processed.
   */
  private groupInstantQueue: Group[] = [];

  /**
   * Queue for instant animator steps to be processed.
   */
  private animatorInstantQueue: Animator[] = [];

  /**
   * Delay between each frame in milliseconds.
   */
  private delay = 50;

  /**
   * Flag to pause the drawing process.
   */
  private pause = false;

  /**
   * Snapshot of figures that have been drawn.
   */
  private snapshot: Figure[] = [];

  /**
   * Snapshot of groups that have been drawn.
   */
  private groupSnapshot: Group[] = [];

  /**
   * Snapshot of animators that have been drawn.
   */
  private animatorSnapshot: Animator[] = [];

  /**
   * Background color of the canvas.
   */
  private backgroundColor = 255;

  private isTravelling = false;

  private traveller: Traveller | null = null;

  /**
   * Main constructor.
   * @param clearOnEachStep - Whether to clear the canvas on each step (default: true).
   */
  constructor(private clearOnEachStep: boolean = true) {
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
    this.p5.createCanvas(1600, 1600).position(0, 0);
  }

  /**
   * Saves a figure to the snapshot and marks it as thrown.
   * @param object - The figure to save.
   */
  private saveToSnapshot(object: Figure) {
    this.snapshot.push(object);
    object.setThrow(true);
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

      let toRemoveCount = group.getFigures().length - 1;
      while (toRemoveCount > 0) {
        queue.shift();
        toRemoveCount--;
      }

      if (!group.getThrow()) {
        group.getFigures().forEach((object) => this.saveToSnapshot(object));
        this.groupSnapshot.push(group);
        group.setThrow(true);
      }
    }
  }

  /**
   * Runs the drawing process for the current queue.
   * @param useInstantQueue - Whether to use the instant queue.
   */
  private runner(useInstantQueue = false) {
    if (this.pause) {
      return;
    }

    const queue = useInstantQueue ? this.instantQueue : this.stepsQueue;
    const groupQueue = useInstantQueue
      ? this.groupInstantQueue
      : this.groupStepsQueue;
    const animatorQueue = useInstantQueue
      ? this.animatorInstantQueue
      : this.animatorStepsQueue;

    if (queue.length > 0) {
      const firstObject = <Figure>queue.shift();

      if (
        (firstObject.getShouldTravel() ||
          (firstObject.getGid() && groupQueue[0].getShouldTravel())) &&
        !useInstantQueue
      ) {
        this.isTravelling = true;

        if (firstObject.getGid()) {
          this.traveller = new Traveller(groupQueue[0]);

          return;
        }

        this.traveller = new Traveller(firstObject);
        firstObject.setShouldTravel(false);

        return;
      }

      if (firstObject.getAid()) {
        const animator = animatorQueue[0];

        if (animator) {
          const isDone = animator.draw();

          if (firstObject.getGid()) {
            this.processGroup(queue, groupQueue, false);
          } else {
            if (!firstObject.getThrow()) {
              this.saveToSnapshot(firstObject);
            }
          }

          if (isDone) {
            this.animatorSnapshot.push(animator);
            animatorQueue.shift();
            this.reDrawAll();
          }
        }
      } else if (firstObject.getGid()) {
        this.processGroup(queue, groupQueue);
      } else {
        firstObject.draw();
        if (!firstObject.getThrow()) {
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

    if (this.isTravelling) {
      const done = this.traveller?.draw();

      if (done) {
        this.isTravelling = false;
        const object = this.traveller?.getObject();

        if (object instanceof Figure) {
          this.stepsQueue.unshift(object);
        } else if (object?.getFigures().length) {
          this.stepsQueue.unshift(object.getFigures()[0]);
        }

        this.traveller = null;
        this.runner();
      }

      return;
    }

    if (this.p5.frameCount % this.delay === 0) {
      if (!this.clearOnEachStep) {
        this.p5.clear();
      }
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
    if (!object.getGid()) {
      return undefined;
    }

    return this.groupSnapshot.find(
      (group) => group.getId() === object.getGid()
    );
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

    if (this.pause) {
      this.p5.noLoop();
    } else {
      this.p5.loop();
    }
  }

  /**
   * Checks if the drawing process is paused.
   * @returns Whether the drawing process is paused.
   */
  isPaused() {
    return this.pause;
  }

  /**
   * Gets the delay between each frame.
   * @returns The delay.
   */
  getDelay() {
    return this.delay;
  }

  /**
   * Sets the delay between each frame.
   * @param delay - The delay to set.
   */
  setDelay(delay: number) {
    this.delay = delay;
  }

  /**
   * Gets the background color of the canvas.
   * @returns - The background color.
   */
  getBackgroundColor() {
    return this.backgroundColor;
  }

  /**
   * Sets the background color of the canvas.
   * @param color - The color to set.
   */
  setBackgroundColor(color: number) {
    this.backgroundColor = color;
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

    for (let i = 0; i < this.snapshot.length; i++) {
      const figure = this.snapshot[i];

      if (figure.getAid()) {
        const animator = this.animatorSnapshot.find(
          (a) => a.getId() === figure.getAid()
        );

        if (animator && animatorIdToDraw === animator.getId()) {
          this.addAnimator(animator, true);
        }

        const toRemoveCount =
          animator?.getObjects().reduce((acc, object) => {
            if (object instanceof Figure) {
              acc++;
            } else {
              acc += object.getFigures().length;
            }

            return acc;
          }, 0) || 1;

        i += toRemoveCount - 1;
      } else if (figure.getGid()) {
        const group = this.groupSnapshot.find(
          (g) => g.getId() === figure.getGid()
        );

        if (group) {
          this.addGroup(group, true);
        }

        const toRemoveCount = (group?.getFigures().length || 1) - 1;
        i += toRemoveCount;
      } else {
        this.addFigure(figure, true);
      }
    }

    this.p5.clear();
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
      group.getFigures().forEach((figure) => this.addFigure(figure, instant));
    } else {
      this.groupStepsQueue.push(group);
      group.getFigures().forEach((figure) => this.addFigure(figure, instant));
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
      animator.getObjects().forEach((object) => {
        if (object instanceof Figure) {
          this.addFigure(object, instant);
        } else {
          this.addGroup(object as Group, instant);
        }
      });
    } else {
      this.animatorStepsQueue.push(animator);
      animator.getObjects().forEach((object) => {
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
    this.snapshot = this.snapshot.filter((f) => f.getId() !== figure.getId());

    if (figure.getAid()) {
      const animator = this.animatorSnapshot.find(
        (a) => a.getId() !== figure.getAid()
      );
      animator?.removeObject(figure);
    }

    if (figure.getGid()) {
      const group = this.groupSnapshot.find(
        (g) => g.getId() === figure.getGid()
      );
      group?.removeFigure(figure);
    }

    this.reDrawAll();
  }

  /**
   * Removes a group from the snapshot.
   * @param group - The group to remove.
   */
  removeGroup(group: Group) {
    let toRemove = <Group | null>null;

    this.groupSnapshot = this.groupSnapshot.filter((g) => {
      if (g.getId() === group.getId()) {
        toRemove = g;
        return false;
      }

      return true;
    });

    toRemove?.getFigures().forEach((figure) => {
      figure.setGid('');
      this.removeFigure(figure);
    });
  }

  /**
   * Removes an animator from the snapshot.
   * @param animator - The animator to remove.
   */
  removeAnimator(animator: Animator) {
    let toRemove = <Animator | null>null;

    this.animatorSnapshot = this.animatorSnapshot.filter((a) => {
      if (a.getId() === animator.getId()) {
        toRemove = a;
        return false;
      }

      return true;
    });

    toRemove?.getObjects().forEach((object) => {
      object.setAid('');

      if (object instanceof Figure) {
        this.removeFigure(object);
      } else {
        this.removeGroup(object as Group);
      }
    });
  }
}

export default Main;
