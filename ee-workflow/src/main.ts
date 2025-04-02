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
   * Speed multiplier for the drawing process.
   */
  private speedMultiplier = 1;

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
   * Set of checkpoints to be used for save points that can be loaded.
   */
  private checkpoints: Set<string> = new Set();

  /**
   * Background color of the canvas.
   */
  private backgroundColor = 255;

  /**
   * Flag to indicate if the canvas is drawing a figure as an animation.
   */
  private isTravelling = false;

  /**
   * Traveller object to manage the animation of a figure.
   */
  private traveller: Traveller | null = null;

  /**
   * Last hovered group.
   */
  private hoveredGroup: Group | null = null;

  /**
   * Last hovered figure.
   */
  private hoveredFigure: Figure | null = null;

  /**
   * Number of steps to skip in the stepsQueue at once.
   */
  private stepsToSkip = 0;

  /**
   * Main constructor.
   * @param clearBeforeTravel - Whether to clear the canvas before travelling.
   * @param container - The container to append the canvas to.
   * @param figureToStart - The figure to start from.
   * @param onDrawListener - The listener to call when a figure is drawn.
   * @param preloader - The preloader function to run before setup.
   */
  constructor(
    private clearBeforeTravel = false,
    container?: HTMLElement,
    private figureToStart?: string,
    private onDrawListener?: (id: string) => void,
    private preloader?: (p: p5) => void
  ) {
    this.p5 = new p5(this.init.bind(this), container);
  }

  /**
   * Initialize.
   * @param p - The p5 instance.
   */
  private init(p: p5) {
    p.preload = this.preload.bind(this);
    p.setup = this.setUp.bind(this);
    p.draw = this.draw.bind(this);
    p.mouseMoved = this.mouseMoved.bind(this);
    p.mouseClicked = this.mouseClicked.bind(this);
  }

  private preload() {
    if (this.preloader) {
      this.preloader(this.p5);
    }
  }

  /**
   * Sets up the canvas.
   */
  private setUp() {
    this.p5.createCanvas(1600, 1600).position(0, 50);
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
   * @param isRestarting - Whether the draw is restarting from a figure.
   */
  private processGroup(
    queue: Figure[],
    groupQueue: Group[],
    shouldDraw = true,
    isRestarting = false
  ) {
    const group = groupQueue.shift();

    if (group) {
      if (shouldDraw) {
        if (isRestarting) {
          group.shouldRunSideEffect(false);
        }

        group.draw();
      }

      let toRemoveCount = group.getFigures().length - 1;
      while (toRemoveCount > 0) {
        const figure = queue.shift();
        this.onDrawListener?.(figure?.getId() || '');
        toRemoveCount--;
      }

      if (!group.getThrow()) {
        group.getFigures().forEach((object) => this.saveToSnapshot(object));
        this.groupSnapshot.push(group);
        group.setThrow(true);
      }

      this.onDrawListener?.(group.getId());
    }
  }

  /**
   * Processes an animator, drawing it and saving to snapshot if necessary.
   * @param firstObject - The first object in the queue.
   * @param queue - The queue of figures.
   * @param groupQueue - The queue of groups.
   * @param animatorQueue - The queue of animators.
   * @param shouldDraw - Whether to draw the animator.
   * @param isRestarting - Whether the draw is restarting from a figure.
   * @param skipRedrawAll - Whether to skip redrawing all figures after the animator.
   */
  private processAnimator(
    firstObject: Figure,
    queue: Figure[],
    groupQueue: Group[],
    animatorQueue: Animator[],
    shouldDraw = true,
    isRestarting = false,
    skipRedrawAll = false
  ) {
    const animator = animatorQueue[0];

    if (animator) {
      if (isRestarting) {
        animator.shouldRunSideEffect(false);
      }

      const isDone = animator.draw(!shouldDraw);

      if (firstObject.getGroupId()) {
        this.processGroup(queue, groupQueue, false, isRestarting);
      } else {
        this.onDrawListener?.(firstObject.getId());

        if (!firstObject.getThrow()) {
          this.saveToSnapshot(firstObject);
        }
      }

      if (isDone) {
        this.animatorSnapshot.push(animator);
        this.onDrawListener?.(animator.getId());
        animatorQueue.shift();
        if (!skipRedrawAll) {
          this.reDrawAll();
        }
      }
    }
  }

  /**
   * Runs the drawing process for the current queue.
   * @param useInstantQueue - Whether to use the instant queue.
   * @param skipDraw - Whether to skip drawing.
   * @param isSkipping - Whether to skip through the queue.
   */
  private runner(
    useInstantQueue = false,
    skipDraw = false,
    isSkipping = false
  ) {
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
        firstObject.getShouldTravel() ||
        (firstObject.getGroupId() && groupQueue?.[0]?.getShouldTravel())
      ) {
        this.isTravelling = true;
        this.traveller = new Traveller(
          firstObject.getGroupId() ? groupQueue[0] : firstObject
        );

        if (skipDraw || useInstantQueue || isSkipping) {
          this.traveller.completeTravelling(skipDraw);
          this.traveller = null;
          this.isTravelling = false;
        } else {
          return;
        }
      }

      if (firstObject.getAnimatorId()) {
        this.processAnimator(
          firstObject,
          queue,
          groupQueue,
          animatorQueue,
          !skipDraw,
          isSkipping,
          useInstantQueue
        );
      } else if (firstObject.getGroupId()) {
        this.processGroup(queue, groupQueue, !skipDraw, isSkipping);
      } else {
        if (!skipDraw) {
          if (isSkipping) {
            firstObject.shouldRunSideEffect(false);
          }

          firstObject.draw();
        }

        this.onDrawListener?.(firstObject.getId());

        if (!firstObject.getThrow()) {
          this.saveToSnapshot(firstObject);
        }
      }

      if (firstObject.getIsCheckpoint()) {
        this.checkpoints.add(firstObject.getId());
      }

      if (this.figureToStart === firstObject.getId()) {
        this.figureToStart = undefined;
      }
    }
  }

  private runTraveller() {
    const done = this.traveller?.draw(this.speedMultiplier);

    if (done) {
      this.isTravelling = false;
      const object = this.traveller?.getObject();

      if (object instanceof Figure) {
        this.stepsQueue.unshift(object);
      } else if (object?.getFigures().length) {
        this.stepsQueue.unshift(object.getFigures()[0]);
      }
    }

    return done;
  }

  /**
   * Draws the current frame, processing the queues.
   */
  private draw() {
    if (this.pause) {
      return;
    }

    if (this.isTravelling) {
      if (this.clearBeforeTravel) {
        this.p5.clear();
      }

      if (this.runTraveller()) {
        this.traveller = null;
        this.runner();
      }
    } else if (this.stepsToSkip > 0) {
      if (this.isTravelling) {
        this.traveller?.completeTravelling();

        this.traveller = null;
        this.runner();
      }

      while (this.stepsToSkip > 0 && this.stepsQueue.length > 0) {
        this.runner(false, false, true);
        this.stepsToSkip--;
      }
    } else if (this.p5.frameCount % this.delay === 0) {
      this.runner();
    }

    while (this.instantQueue.length > 0) {
      this.runner(true);
    }

    while (this.figureToStart && this.stepsQueue.length > 0) {
      this.runner(false, false, true);
    }
  }

  /**
   * Checks if a figure is part of a group.
   * @param object - The figure to check.
   * @returns The group the figure belongs to, or undefined.
   */
  private isGrouped(object: Figure): Group | undefined {
    if (!object.getGroupId()) {
      return undefined;
    }

    return this.groupSnapshot.find(
      (group) => group.getId() === object.getGroupId()
    );
  }

  /**
   * Handles hover events for figures.
   */
  private mouseMoved() {
    this.snapshot.forEach((object) => {
      if (object.getAnimatorId()) {
        return;
      }

      const isHovering = object.isHovering();

      if (!isHovering) {
        if (this.hoveredFigure?.getId() === object.getId()) {
          this.hoveredFigure.onLeave();
          this.hoveredFigure = null;

          if (this.hoveredGroup) {
            this.hoveredGroup.onLeave();
            this.hoveredGroup = null;
          }
        }

        return;
      }

      if (isHovering && this.hoveredFigure?.getId() === object.getId()) {
        return;
      }

      const _object = this.isGrouped(object) || object;

      if (
        isHovering &&
        _object instanceof Group &&
        this.hoveredGroup?.getId() === _object.getId()
      ) {
        this.hoveredFigure = object;
        return;
      }

      if (isHovering) {
        this.hoveredFigure = object;
        this.hoveredGroup = _object instanceof Group ? _object : null;

        this.hoveredFigure?.mouseMoved();
        this.hoveredGroup?.mouseMoved();
      }
    });
  }

  /**
   * Handles click events for figures.
   */
  private mouseClicked() {
    this.snapshot.forEach((object) => {
      const isHovering = object.isHovering();
      if (isHovering) {
        const _object = this.isGrouped(object) || object;

        _object.mouseClicked();
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
   * Updates the speed of the drawing process.
   * @param speedMultiplier - The speed multiplier, 0.5 for half speed, 2 for double speed, etc.
   */
  updateSpeed(speedMultiplier: number) {
    this.speedMultiplier = speedMultiplier;
    this.delay = 50 / speedMultiplier;
  }

  /**
   * Checks if the drawing process is paused.
   * @returns Whether the drawing process is paused.
   */
  isPaused() {
    return this.pause;
  }

  /**
   * Resets the drawing process to the first checkpoint.
   */
  reset() {
    while (this.checkpoints.size) {
      this.loadPreviousCheckpoint();
    }
  }

  /**
   * If a animator is still rendering, it will be reset and the already rendered figures/group will be removed from the snapshot and readded to the queue.
   * @param checkpoint - The checkpoint to load.
   * @returns - Whether the checkpoint was part of the animator.
   */
  private handleAnimatorOnPreviousCheckpointLoad(checkpoint: string): boolean {
    if (this.snapshot.length === 0) {
      return false;
    }

    const lastSnapshotObject = this.snapshot[this.snapshot.length - 1];

    if (!lastSnapshotObject.getAnimatorId()) {
      return false;
    }

    const animatorInSnapshot = this.animatorSnapshot.find(
      (animator) => animator.getId() === lastSnapshotObject.getAnimatorId()
    );

    if (animatorInSnapshot) {
      return false;
    }

    let isCheckpointLoaded = false;
    const toBeLoadedFigures = [];
    let found = false;

    while (!found && this.snapshot.length) {
      const figure = this.snapshot.pop();

      if (
        figure &&
        figure.getAnimatorId() !== lastSnapshotObject.getAnimatorId()
      ) {
        this.snapshot.push(figure);
        found = true;
        break;
      }

      if (figure) {
        toBeLoadedFigures.push(figure);
        figure.setThrow(false);

        if (figure.getCanTravel()) {
          figure.setShouldTravel(true);
          figure.resetTraveller();
        }

        if (figure.getId()) {
          isCheckpointLoaded = figure.getId() === checkpoint;
        }
      }
    }

    const toBeLoadedGroups = [];
    found = false;

    while (!found && this.groupSnapshot.length) {
      const group = this.groupSnapshot.pop();

      if (
        group &&
        group.getAnimatorId() !== lastSnapshotObject.getAnimatorId()
      ) {
        this.groupSnapshot.push(group);
        found = true;
        break;
      }

      if (group) {
        toBeLoadedGroups.push(group);
        group.setThrow(false);
      }
    }

    this.stepsQueue.unshift(...toBeLoadedFigures.reverse());
    this.groupStepsQueue.unshift(...toBeLoadedGroups.reverse());
    this.animatorStepsQueue?.[0].resetIndex();

    return isCheckpointLoaded;
  }

  /**
   * Pops the previous checkpoint from the stack.
   * @returns The previous checkpoint.
   */
  private popPreviousCheckpoint(): string | undefined {
    let checkpoint = Array.from(this.checkpoints).pop();

    if (!checkpoint) {
      return undefined;
    }

    this.checkpoints.delete(checkpoint);

    if (checkpoint === this.snapshot?.[this.snapshot.length - 1]?.getId()) {
      checkpoint = this.popPreviousCheckpoint();
    }

    return checkpoint;
  }

  /**
   * Loads the previous checkpoint. This will re-render instantly all figures up to the previous checkpoint and start the queue from there.
   * @returns - The previous checkpoint.
   */
  loadPreviousCheckpoint() {
    const checkpoint = this.popPreviousCheckpoint();

    if (!checkpoint) {
      return undefined;
    }

    this.togglePause();

    while (this.instantQueue.length) {
      this.runner(true);
    }

    if (this.isTravelling) {
      while (this.isTravelling) {
        this.runTraveller();
      }

      const object = this.traveller?.getObject();

      if (object instanceof Group) {
        object?.getFigures().forEach((figure) => {
          if (figure.getCanTravel()) {
            figure?.resetTraveller();
            figure?.setShouldTravel(true);
          }
        });
      } else {
        object?.resetTraveller();
        object?.setShouldTravel(true);
      }

      this.traveller = null;
    }

    if (this.handleAnimatorOnPreviousCheckpointLoad(checkpoint)) {
      this.togglePause();
      this.reDrawAll();
      return checkpoint;
    }

    const toBeLoadedObjects = [];
    const toCheckGroups = new Set<string>();
    const toCheckAnimators = new Set<string>();
    let found = false;

    while (!found && this.snapshot.length) {
      const figure = this.snapshot.pop();

      if (figure?.getId() === checkpoint) {
        found = true;
      }

      if (figure) {
        toBeLoadedObjects.push(figure);
        figure.setThrow(false);

        if (figure.getCanTravel()) {
          figure.setShouldTravel(true);
          figure.resetTraveller();
        }

        if (figure.getGroupId()) {
          toCheckGroups.add(figure.getGroupId());
        }

        if (figure.getAnimatorId()) {
          toCheckAnimators.add(figure.getAnimatorId());
        }
      }
    }

    const toBeLoadedGroups = [];

    while (this.groupSnapshot.length && toCheckGroups.size) {
      const group = this.groupSnapshot.pop();

      if (group) {
        toCheckGroups.delete(group?.getId());
        toBeLoadedGroups.push(group);
        group.setThrow(false);
      }
    }

    const toBeLoadedAnimators = [];

    while (this.animatorSnapshot.length && toCheckAnimators.size) {
      const animator = this.animatorSnapshot.pop();

      if (animator) {
        toCheckAnimators.delete(animator?.getId());
        toBeLoadedAnimators.push(animator);
        animator.setThrow(false);
      }
    }

    this.stepsQueue.unshift(...toBeLoadedObjects.reverse());
    this.groupStepsQueue.unshift(...toBeLoadedGroups.reverse());
    this.animatorStepsQueue.unshift(...toBeLoadedAnimators.reverse());

    this.togglePause();
    this.reDrawAll();

    return checkpoint;
  }

  /**
   * Loads the next checkpoint. This will re-render instantly all figures up to the next checkpoint and start the queue from there.
   * @returns - The next checkpoint.
   */
  loadNextCheckpoint() {
    this.togglePause();

    while (this.instantQueue.length) {
      this.runner(true);
    }

    if (this.isTravelling) {
      while (this.isTravelling) {
        this.runTraveller();
      }

      this.traveller = null;
      this.runner(false, true);
    }

    while (this.stepsQueue.length && !this.stepsQueue[0].getIsCheckpoint()) {
      this.runner(false, true);
    }

    this.togglePause();
    this.reDrawAll();

    return this.stepsQueue[0]?.getId();
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
  resetQueuesAndReDrawAll() {
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

  loadSnapshot(animatorIdToDraw?: string) {
    for (let i = 0; i < this.snapshot.length; i++) {
      const figure = this.snapshot[i];

      if (figure.getAnimatorId()) {
        const animator = this.animatorSnapshot.find(
          (a) => a.getId() === figure.getAnimatorId()
        );

        if (animator && animatorIdToDraw === animator.getId()) {
          this.addAnimator(animator, true, false, false);
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
      } else if (figure.getGroupId()) {
        const group = this.groupSnapshot.find(
          (g) => g.getId() === figure.getGroupId()
        );

        if (group) {
          this.addGroup(group, true, false, false);
        }

        const toRemoveCount = (group?.getFigures().length || 1) - 1;
        i += toRemoveCount;
      } else {
        this.addFigure(figure, true, false, false);
      }
    }

    this.p5.clear();
  }

  loadSnapshotAndReDraw(animatorIdToDraw?: string) {
    this.loadSnapshot(animatorIdToDraw);

    while (this.instantQueue.length) {
      this.runner(true);
    }
  }

  /**
   * Redraws all figures on the canvas.
   * @param animatorIdToDraw - The ID of the animator to draw.
   */
  reDrawAll(animatorIdToDraw?: string) {
    if (this.pause) {
      return;
    }

    this.loadSnapshot(animatorIdToDraw);
  }

  /**
   * Adds a figure to the queue.
   * @param figure - The figure to add.
   * @param instant - Whether to add to the instant queue.
   * @param isCheckpoint - Whether to add as a checkpoint.
   * @param runSideEffect - Whether to run the side effect.
   */
  addFigure(
    figure: Figure,
    instant = false,
    isCheckpoint = false,
    runSideEffect = true
  ) {
    figure.shouldRunSideEffect(runSideEffect);

    if (isCheckpoint) {
      figure.setCheckpoint(true);
    }

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
   * @param isCheckpoint - Whether to add as a checkpoint.
   * @param runSideEffect - Whether to run the side effect.
   */
  addGroup(
    group: Group,
    instant = false,
    isCheckpoint = false,
    runSideEffect = true
  ) {
    group.shouldRunSideEffect(runSideEffect);

    if (instant) {
      this.groupInstantQueue.push(group);
    } else {
      this.groupStepsQueue.push(group);
    }

    group
      .getFigures()
      .forEach((figure, index) =>
        this.addFigure(
          figure,
          instant,
          index === 0 ? isCheckpoint : false,
          runSideEffect
        )
      );
  }

  /**
   * Adds an animator to the queue.
   * @param animator - The animator to add.
   * @param instant - Whether to add to the instant queue.
   * @param isCheckpoint - Whether to add as a checkpoint.
   * @param runSideEffect - Whether to run the side effect.
   */
  addAnimator(
    animator: Animator,
    instant = false,
    isCheckpoint = false,
    runSideEffect = true
  ) {
    animator.shouldRunSideEffect(runSideEffect);

    if (instant) {
      this.animatorInstantQueue.push(animator);
    } else {
      this.animatorStepsQueue.push(animator);
    }

    animator.getObjects().forEach((object, index) => {
      const _isCheckpoint = isCheckpoint && index === 0;

      if (object instanceof Figure) {
        this.addFigure(object, instant, _isCheckpoint, runSideEffect);
      } else {
        this.addGroup(object as Group, instant, _isCheckpoint, runSideEffect);
      }
    });
  }

  /**
   * Removes a figure from the snapshot.
   * @param figure - The figure to remove.
   */
  removeFigure(figure: Figure) {
    this.snapshot = this.snapshot.filter((f) => f.getId() !== figure.getId());

    if (figure.getAnimatorId()) {
      const animator = this.animatorSnapshot.find(
        (a) => a.getId() !== figure.getAnimatorId()
      );
      animator?.removeObject(figure);
    }

    if (figure.getGroupId()) {
      const group = this.groupSnapshot.find(
        (g) => g.getId() === figure.getGroupId()
      );
      group?.removeFigure(figure);
    }

    const animatorId = figure.getAnimatorId() || undefined;
    this.reDrawAll(animatorId);
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

    if (toRemove?.getAnimatorId()) {
      const animator = this.animatorSnapshot.find(
        (a) => a.getId() !== toRemove?.getAnimatorId()
      );
      animator?.removeObject(toRemove);
    }

    toRemove?.getFigures().forEach((figure) => {
      figure.setGroupId('');
      this.removeFigure(figure);
    });

    const animatorId = toRemove?.getAnimatorId() || undefined;
    this.reDrawAll(animatorId);
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
      object.setAnimatorId('');

      if (object instanceof Figure) {
        this.removeFigure(object);
      } else {
        this.removeGroup(object as Group);
      }
    });

    this.reDrawAll();
  }

  /**
   * Gets the current checkpoint index.
   * @returns The current checkpoint index.
   */
  getCurrentCheckpointIndex() {
    return this.checkpoints.size - 1;
  }

  skipSteps(steps: number) {
    this.stepsToSkip = steps;
  }

  isStepping() {
    return this.stepsQueue.length > 0;
  }
}

export default Main;
