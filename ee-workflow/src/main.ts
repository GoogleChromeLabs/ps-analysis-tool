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
import Stats from 'stats.js';

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

  private stats: Stats | null = null;

  /**
   * Flag to keep track of loop
   */
  private noLoop = false;

  /**
   * Flag for use helper queue.
   */
  private usingHelperQueue = false;

  /**
   * Queue used to render some figures from stepsQueue without disturbing it's order.
   */
  private helperQueue: Figure[] = [];

  /**
   * Queue used to render some groups from stepsQueue without disturbing it's order.
   */
  private helperGroupQueue: Group[] = [];

  /**
   * Queue used to render some animator from stepsQueue without disturbing it's order.
   */
  private helperAnimatorQueue: Animator[] = [];

  /**
   * Main constructor.
   * @param clearBeforeTravel - Whether to clear the canvas before travelling.
   * @param container - The container to append the canvas to.
   * @param figureToStart - The figure to start from.
   * @param preloader - The preloader function to run before setup.
   * @param performanceCheck - Whether to enable performance check.
   */
  constructor(
    private clearBeforeTravel = false,
    private container?: HTMLElement,
    private figureToStart?: string,
    private preloader?: (p: p5) => void,
    performanceCheck = false
  ) {
    this.p5 = new p5(this.init.bind(this), container);

    if (performanceCheck) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      this.stats.dom.style = 'position: absolute; right: 0; top: 0;';
      document.body.appendChild(this.stats.dom);
    }
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
    p.windowResized = this.windowResized.bind(this);
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
    const containerWidth = this.container?.clientWidth || 1600;
    const containerHeight = this.container?.clientHeight || 1600;

    this.p5.createCanvas(containerWidth, containerHeight).position(0, 50);
  }

  private dispatchCustomEvent(eventName: string, data: any) {
    const event = new CustomEvent(eventName, {
      detail: data,
    });
    document.dispatchEvent(event);
  }

  /**
   * Saves a figure to the snapshot and marks it as thrown.
   * @param object - The figure to save.
   */
  private saveToSnapshot(object: Figure) {
    if (this.figureToStart === object.getId()) {
      this.figureToStart = undefined;
    }

    this.snapshot.push(object);
    // custom event listener for figure draw
    this.dispatchCustomEvent('figureDraw', {
      figureId: object.getId(),
    });
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
        queue.shift();
        toRemoveCount--;
      }

      if (!group.getThrow()) {
        group.getFigures().forEach((object) => this.saveToSnapshot(object));
        this.groupSnapshot.push(group);
        group.setThrow(true);
        this.dispatchCustomEvent('groupDraw', {
          groupId: group.getId(),
        });
      }
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
        if (!firstObject.getThrow()) {
          this.saveToSnapshot(firstObject);
        }
      }

      if (isDone) {
        if (!animator.getThrow()) {
          this.animatorSnapshot.push(animator);
          animator.setThrow(true);
          this.dispatchCustomEvent('animatorDraw', {
            animatorId: animator.getId(),
          });
        }
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
    let queue: Figure[] = [];
    let groupQueue: Group[] = [];
    let animatorQueue: Animator[] = [];

    queue = useInstantQueue ? this.instantQueue : this.stepsQueue;
    groupQueue = useInstantQueue
      ? this.groupInstantQueue
      : this.groupStepsQueue;
    animatorQueue = useInstantQueue
      ? this.animatorInstantQueue
      : this.animatorStepsQueue;

    if (!useInstantQueue && this.usingHelperQueue) {
      queue = this.helperQueue;
      groupQueue = this.helperGroupQueue;
      animatorQueue = this.helperAnimatorQueue;
    }

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

        if (!firstObject.getThrow()) {
          this.saveToSnapshot(firstObject);
        }
      }

      if (firstObject.getIsCheckpoint()) {
        this.checkpoints.add(firstObject.getId());
      }
    }
  }

  private runTraveller() {
    const done = this.traveller?.draw(this.speedMultiplier);

    if (done) {
      this.isTravelling = false;
      const object = this.traveller?.getObject();
      const queue = this.helperQueue.length
        ? this.helperQueue
        : this.stepsQueue;

      if (object instanceof Figure) {
        queue.unshift(object);
      } else if (object?.getFigures().length) {
        queue.unshift(object.getFigures()[0]);
      }
    }

    return done;
  }

  /**
   * Draws the current frame, processing the queues.
   */
  private draw() {
    this.stats?.begin();

    if (this.pause) {
      this.stats?.end();
      return;
    }

    if (
      (this.stepsQueue.length === 0 && this.instantQueue.length === 0) ||
      (this.usingHelperQueue && this.helperQueue.length === 0)
    ) {
      this.dispatchCustomEvent('noLoop', {
        message: 'Animation ended',
      });
      this.p5.noLoop();
      this.noLoop = true;
    }

    if (this.isTravelling) {
      if (this.clearBeforeTravel) {
        this.p5.clear();
      }

      if (this.runTraveller()) {
        this.traveller = null;
        this.runner();
      }
    } else if (this.p5.frameCount % this.delay === 0) {
      if (
        !this.usingHelperQueue ||
        (this.usingHelperQueue && this.helperQueue.length)
      ) {
        this.runner();
      }
    }

    while (this.instantQueue.length > 0) {
      this.runner(true);
    }

    while (
      this.figureToStart &&
      this.stepsQueue.length > 0 &&
      !this.instantQueue.length
    ) {
      this.runner(false, false, true);
    }

    this.stats?.end();
  }

  private windowResized() {
    this.p5.resizeCanvas(
      this.container?.clientWidth || 1600,
      this.container?.clientHeight || 1600
    );
    this.loadAnimatorPartAndDraw();
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
    let didHover = false;

    if (this.snapshot.length === 0) {
      return;
    }

    this.snapshot.some((object) => {
      if (object.getAnimatorId()) {
        return false;
      }

      const isHovering = object.isHovering();

      if (isHovering) {
        didHover = true;
      }

      if (!isHovering) {
        if (this.hoveredFigure?.getId() === object.getId()) {
          this.hoveredFigure.onLeave();
          this.hoveredFigure = null;

          if (this.hoveredGroup) {
            this.hoveredGroup.onLeave();
            this.hoveredGroup = null;
          }
        }

        return false;
      }

      if (isHovering && this.hoveredFigure?.getId() === object.getId()) {
        return true;
      }

      const _object = this.isGrouped(object) || object;

      if (
        isHovering &&
        _object instanceof Group &&
        this.hoveredGroup?.getId() === _object.getId()
      ) {
        this.hoveredFigure = object;
        return true;
      }

      if (isHovering) {
        this.hoveredFigure = object;
        this.hoveredGroup = _object instanceof Group ? _object : null;

        this.hoveredFigure?.mouseMoved();
        this.hoveredGroup?.mouseMoved();
      }

      return true;
    });

    if (didHover) {
      this.p5.cursor(this.p5.HAND);
    } else {
      this.p5.cursor(this.p5.ARROW);
    }
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
   * @param pause - Whether to pause or unpause the drawing process.
   */
  togglePause(pause?: boolean) {
    if (pause !== undefined) {
      this.pause = pause;
    } else {
      if (this.noLoop) {
        if (!this.pause) {
          this.p5.loop();
          this.noLoop = false;
        }
      } else {
        if (this.pause) {
          this.p5.noLoop();
          this.noLoop = true;
        }
      }

      this.pause = !this.pause;
    }

    this.noLoop = this.pause;

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
    this.delay = Math.floor(50 / speedMultiplier);
  }

  /**
   * Checks if the drawing process is paused.
   * @returns Whether the drawing process is paused.
   */
  isPaused() {
    return this.pause;
  }

  isLooping() {
    return !this.noLoop;
  }

  isUsingHelperQueue() {
    return this.usingHelperQueue;
  }

  /**
   * Resets the drawing process to the first checkpoint.
   */
  reset() {
    if (this.usingHelperQueue) {
      this.resetAfterHelperQueue();
      return;
    }

    this.figureToStart = undefined;
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

    if (
      !this.animatorStepsQueue?.[0]
        ?.getObjects()
        .find((object) => object.getId() === checkpoint)
    ) {
      return checkpoint;
    }

    checkpoint = this.popPreviousCheckpoint();

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

    this.togglePause(true);

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

    this.handleAnimatorOnPreviousCheckpointLoad(checkpoint);

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

    if (this.noLoop) {
      this.dispatchCustomEvent('loop', {
        message: 'Animation start',
      });
      this.p5.loop();
      this.noLoop = false;
    }

    this.togglePause(false);
    this.reDrawAll();

    return checkpoint;
  }

  /**
   * Loads the next checkpoint. This will re-render instantly all figures up to the next checkpoint and start the queue from there.
   * @returns - The next checkpoint.
   */
  loadNextCheckpoint() {
    this.togglePause(true);

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

    if (this.noLoop) {
      this.dispatchCustomEvent('loop', {
        message: 'Animation start',
      });
      this.p5.loop();
      this.noLoop = false;
    }

    this.togglePause(false);
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

  /**
   * Loads a snapshot of figures, groups, and animators from the snapshot arrays.
   * @param animatorIdToDraw - The ID of the animator to draw.
   */
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

  /**
   * Loads a snapshot of figures, groups, and animators from the snapshot arrays and draws them instantly.
   * @param animatorIdToDraw - The ID of the animator to draw.
   * @param shift - The shift to apply to the figures.
   * @param shift.x - The x-coordinate shift.
   * @param shift.y - The y-coordinate shift.
   */
  loadSnapshotAndReDraw(
    animatorIdToDraw?: string,
    shift?: { x: number; y: number }
  ) {
    this.loadSnapshot(animatorIdToDraw);

    const iQueue = [...this.instantQueue];

    if (shift) {
      for (let i = 0; i < iQueue.length; i++) {
        const figure = iQueue[i];

        if (figure.getAnimatorId()) {
          figure.shift(shift.x, shift.y);
        }
      }
    }

    while (this.instantQueue.length) {
      this.runner(true);
    }

    if (shift) {
      for (let i = 0; i < iQueue.length; i++) {
        const figure = iQueue[i];

        if (figure.getAnimatorId()) {
          figure.shift(-shift.x, -shift.y);
        }
      }
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
   * Loads and draws an completed animator part instantly.
   * @param animatorId - The ID of the animator to load.
   * @param useQueue - Whether to use the queue.
   */
  loadAnimatorPartAndDraw(animatorId?: string, useQueue?: boolean) {
    this.p5.clear();

    const _animatorId =
      animatorId || (useQueue ? this.animatorStepsQueue[0]?.getId() : '');

    for (let i = 0; i < this.snapshot.length; i++) {
      const figure = this.snapshot[i];

      if (figure.getAnimatorId()) {
        if (figure.getAnimatorId() === _animatorId) {
          figure.draw();
        }
      } else {
        figure.draw();
      }
    }
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

    if (this.noLoop) {
      this.dispatchCustomEvent('loop', {
        message: 'Animation start',
      });
      this.p5.loop();
      this.noLoop = false;
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

    const currentFigure = this.stepsQueue[0].getId();
    this.reset();
    this.figureToStart = currentFigure;
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

    const currentFigure = this.stepsQueue[0].getId();
    this.reset();
    this.figureToStart = currentFigure;
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

  stepNext() {
    this.togglePause(true);
    this.dispatchCustomEvent('noLoop', {
      message: 'Animation end',
    });

    while (this.isTravelling) {
      this.runTraveller();
    }

    const lastSnapshotObject = this.snapshot[this.snapshot.length - 1];
    const toRender = this.stepsQueue[0];

    if (toRender.getAnimatorId() !== lastSnapshotObject.getAnimatorId()) {
      this.p5.clear();

      for (let i = 0; i < this.snapshot.length; i++) {
        const figure = this.snapshot[i];

        if (
          figure.getAnimatorId() &&
          figure.getAnimatorId() !== toRender.getAnimatorId()
        ) {
          continue;
        }

        if (figure.getCanTravel()) {
          figure.setShouldTravel(true);
          figure.resetTraveller();
          figure.completeTraveller();
        } else {
          figure.draw();
        }
      }
    }

    this.runner(false, false, true);
  }

  stepBack() {
    this.togglePause(true);
    this.dispatchCustomEvent('noLoop', {
      message: 'Animation end',
    });

    const wasTravelling = this.isTravelling;
    while (this.isTravelling) {
      this.runTraveller();
    }

    const lastSnapshotObject = this.snapshot[this.snapshot.length - 1];

    if (lastSnapshotObject.getCanTravel()) {
      lastSnapshotObject?.resetTraveller();
      lastSnapshotObject?.setShouldTravel(true);
    }

    lastSnapshotObject.setThrow(false);

    let animator: Animator | null = null;
    if (lastSnapshotObject.getAnimatorId()) {
      if (
        this.animatorSnapshot[this.animatorSnapshot.length - 1]?.getId() ===
        lastSnapshotObject.getAnimatorId()
      ) {
        animator = this.animatorSnapshot[this.animatorSnapshot.length - 1];
        animator.setThrow(false);
        this.animatorStepsQueue.unshift(animator);
        this.animatorSnapshot.pop();
      } else {
        animator = this.animatorStepsQueue[0];
      }

      if (!wasTravelling) {
        animator.decrementIndex();
      }
    }

    if (lastSnapshotObject.getGroupId()) {
      const group = this.groupSnapshot[this.groupSnapshot.length - 1];

      group.setThrow(false);

      group.getFigures().forEach((object) => {
        object.setThrow(false);

        if (object.getCanTravel()) {
          object.setShouldTravel(true);
          object.resetTraveller();
        }

        this.snapshot.pop();
      });

      this.groupStepsQueue.unshift(group);
      this.groupSnapshot.pop();
      this.stepsQueue.unshift(...group.getFigures());
    } else {
      this.snapshot.pop();
      this.stepsQueue.unshift(lastSnapshotObject);
    }

    this.p5.clear();
    for (let i = 0; i < this.snapshot.length; i++) {
      const figure = this.snapshot[i];

      if (
        figure.getAnimatorId() &&
        figure.getAnimatorId() !== lastSnapshotObject.getAnimatorId()
      ) {
        continue;
      }

      if (figure.getCanTravel()) {
        figure.setShouldTravel(true);
        figure.resetTraveller();
        figure.completeTraveller();
      } else {
        figure.draw();
      }
    }
  }

  /**
   * Resets the queues and snapshots, load figures in correct order.
   */
  resetAfterHelperQueue() {
    this.helperQueue = [];
    this.helperGroupQueue = [];
    this.helperAnimatorQueue = [];
    this.figureToStart = undefined;
    this.checkpoints = new Set<string>();
    this.p5.clear();

    if (this.isTravelling) {
      this.traveller?.completeTravelling();
      this.traveller = null;
      this.isTravelling = false;
    }

    const figures = [
      ...new Set<Figure>(
        [...this.stepsQueue, ...this.instantQueue, ...this.snapshot].sort(
          (a, b) => a.getCreationOrder() - b.getCreationOrder()
        )
      ),
    ];
    const groups = [
      ...new Set<Group>(
        [
          ...this.groupStepsQueue,
          ...this.groupInstantQueue,
          ...this.groupSnapshot,
        ].sort((a, b) => a.getCreationOrder() - b.getCreationOrder())
      ),
    ];
    const animators = [
      ...new Set<Animator>(
        [
          ...this.animatorStepsQueue,
          ...this.animatorInstantQueue,
          ...this.animatorSnapshot,
        ].sort((a, b) => a.getCreationOrder() - b.getCreationOrder())
      ),
    ];

    this.instantQueue = [];
    this.groupInstantQueue = [];
    this.animatorInstantQueue = [];

    this.stepsQueue = [];
    this.groupStepsQueue = [];
    this.animatorStepsQueue = [];

    this.snapshot = [];
    this.groupSnapshot = [];
    this.animatorSnapshot = [];

    let figureIndex = 0;
    for (figureIndex = 0; figureIndex < figures.length; figureIndex++) {
      const figure = figures[figureIndex];
      figure.setThrow(false);
      figure.shouldRunSideEffect(true);

      if (figure.getCanTravel()) {
        figure.setShouldTravel(true);
        figure.resetTraveller();
      }

      if (figure.getIsCheckpoint()) {
        break;
      }

      if (
        figure.getAnimatorId() &&
        this.instantQueue[this.instantQueue.length - 1]?.getAnimatorId() !==
          figure.getAnimatorId()
      ) {
        const animator = animators.shift();

        if (animator) {
          animator.resetIndex();
          animator.setThrow(false);
          animator.shouldRunSideEffect(true);
          this.animatorInstantQueue.push(animator);
        }
      }

      if (
        figure.getGroupId() &&
        this.instantQueue[this.instantQueue.length - 1]?.getGroupId() !==
          figure.getGroupId()
      ) {
        const group = groups.shift();

        if (group) {
          group.setThrow(false);
          group.shouldRunSideEffect(true);
          this.groupInstantQueue.push(group);
        }
      }

      this.instantQueue.push(figure);
    }

    for (let i = figureIndex; i < figures.length; i++) {
      const figure = figures[i];
      figure.setThrow(false);
      figure.shouldRunSideEffect(true);
      if (figure.getCanTravel()) {
        figure.setShouldTravel(true);
        figure.resetTraveller();
      }
    }

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      group.setThrow(false);
      group.shouldRunSideEffect(true);
    }

    for (let i = 0; i < animators.length; i++) {
      const animator = animators[i];
      animator.resetIndex();
      animator.setThrow(false);
      animator.shouldRunSideEffect(true);
    }

    this.stepsQueue = [...figures.slice(figureIndex)];
    this.groupStepsQueue = [...groups];
    this.animatorStepsQueue = [...animators];

    this.p5.clear();
  }

  /**
   * Update the usingHelperQueue flag. Reset queues if helperQueue is disabled.
   * @param value - Whether to use the helper queue.
   */
  setUsingHelperQueue(value: boolean) {
    if (!value) {
      this.resetAfterHelperQueue();
      this.togglePause(false);
    }
    this.usingHelperQueue = value;
  }

  // eslint-disable-next-line complexity
  loadCheckpointToHelper(checkpoint: string) {
    if (this.helperQueue.length) {
      return;
    }

    this.togglePause(true);
    this.helperQueue = [];

    const recentCheckpoint = [...this.checkpoints].pop();

    if (recentCheckpoint === checkpoint) {
      while (
        this.stepsQueue.length &&
        !this.stepsQueue?.[0].getIsCheckpoint()
      ) {
        if (
          this.stepsQueue[0].getAnimatorId() &&
          this.stepsQueue[0].getAnimatorId() !==
            this.helperQueue[this.helperQueue.length - 1]?.getAnimatorId()
        ) {
          const animator = this.animatorStepsQueue.shift();

          if (animator) {
            this.helperAnimatorQueue.push(animator);
          }
        }

        if (
          this.stepsQueue[0].getGroupId() &&
          this.stepsQueue[0].getGroupId() !==
            this.helperQueue[this.helperQueue.length - 1]?.getGroupId()
        ) {
          const group = this.groupStepsQueue.shift();

          if (group) {
            this.helperGroupQueue.push(group);
          }
        }

        this.helperQueue.push(this.stepsQueue.shift()!);
      }

      this.togglePause(false);

      return;
    }

    if (
      recentCheckpoint &&
      this.stepsQueue.length &&
      !this.stepsQueue?.[0]?.getIsCheckpoint()
    ) {
      while (this.isTravelling) {
        this.runTraveller();
      }

      this.handleAnimatorOnPreviousCheckpointLoad(recentCheckpoint);
      this.loadSnapshotAndReDraw();
    }

    if (this.stepsQueue.length) {
      let foundCheckpoint = false;

      for (let i = 0; i < this.stepsQueue.length; i++) {
        const figure = this.stepsQueue[i];

        if (figure.getId() !== checkpoint && !foundCheckpoint) {
          continue;
        }

        if (figure.getIsCheckpoint() && figure.getId() !== checkpoint) {
          break;
        }

        foundCheckpoint = true;

        if (
          figure.getAnimatorId() &&
          figure.getAnimatorId() !==
            this.helperQueue[this.helperQueue.length - 1]?.getAnimatorId()
        ) {
          const animator = this.animatorStepsQueue.find(
            (a) => a.getId() === figure.getAnimatorId()
          );

          if (animator) {
            this.helperAnimatorQueue.push(animator);
          }
        }

        if (
          figure.getGroupId() &&
          figure.getGroupId() !==
            this.helperQueue[this.helperQueue.length - 1]?.getGroupId()
        ) {
          const group = this.groupStepsQueue.find(
            (g) => g.getId() === figure.getGroupId()
          );

          if (group) {
            this.helperGroupQueue.push(group);
          }
        }

        this.helperQueue.push(figure);
      }

      const helperSet = new Set<string>(this.helperQueue.map((f) => f.getId()));

      this.stepsQueue = this.stepsQueue.filter(
        (figure) => !helperSet.has(figure.getId())
      );
    }

    this.togglePause(false);
  }
}

export default Main;
