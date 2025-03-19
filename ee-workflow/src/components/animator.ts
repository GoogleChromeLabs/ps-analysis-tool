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
 * Internal dependencies.
 */
import Figure from './figure';
import FigureFactory from './figure/figureFactory';
import Group from './group';

/**
 * Class for creating animators.
 * Contains logic for rendering objects in a sequence to create an animation.
 */
export default class Animator {
  /**
   * Unique id of the animator.
   */
  private id: string;

  /**
   * Array of objects to be animated. Can be figures or groups.
   * The last object in the array is a dummy object that acts as a placeholder for the end of the animation.
   */
  private objects: Array<Figure | Group> = [];

  /**
   * Index of the current object being animated.
   */
  private index = 0;

  /**
   * Flag to indicate if the animation should be saved in animatorSnapshot.
   * If true, the animation will NOT be saved in animatorSnapshot.
   */
  private throw = false;

  /**
   * Whether the side effect should be run.
   */
  protected runSideEffect?: boolean;

  /**
   * Function to be executed when the animation ends.
   */
  private sideEffectOnEnd: (() => void) | undefined;

  /**
   * Counter for the number of animations created.
   */
  static animationCounter = 0;

  constructor(
    objects: Array<Figure | Group>,
    figureFactory: FigureFactory,
    id?: string
  ) {
    Animator.animationCounter++;
    this.id =
      id ||
      `animation-${Animator.animationCounter}` +
        Math.random().toString(36).slice(2, 9);
    this.objects = [
      ...objects,
      figureFactory.line({
        x: 0,
        y: 0,
        endX: 0,
        endY: 0,
      }), // last dummy object acts as a placeholder for the end of the animation
    ];
    this.objects.forEach((object) => object.setAnimatorId(this.id));
  }

  /**
   * Draws the current object in the animation sequence, and increments the index.
   * If the index reaches the end of the sequence, it resets the index to 0.
   * @param skipDraw - boolean indicating if the draw function should be skipped
   * @returns boolean indicating if the animation has finished
   */
  draw(skipDraw = false): boolean {
    if (this.index === this.objects.length - 1) {
      this.index = 0;

      if (!skipDraw) {
        this.sideEffectOnEnd?.();
      }

      return true;
    }

    if (!skipDraw) {
      this.objects[this.index].draw();
    }

    this.index++;

    return false;
  }

  /**
   * Resets the index of the animator to 0.
   */
  resetIndex() {
    this.index = 0;
  }

  /**
   * Sets a side effect to be executed when the animation ends
   * @param sideEffect - function to be executed when the animation ends
   */
  setSideEffectOnEnd(sideEffect: () => void) {
    this.sideEffectOnEnd = sideEffect;
  }

  /**
   * Gets the unique id of the animator.
   * @returns unique id of the animator
   */
  getId(): string {
    return this.id;
  }

  /**
   * Gets the throw flag.
   * @returns true if the animation will NOT be saved in animatorSnapshot.
   */
  getThrow(): boolean {
    return this.throw;
  }

  /**
   * Sets the throw flag to true.
   * If true, the animation will NOT be saved in animatorSnapshot.
   * @param throwFlag - boolean indicating if the animation should be saved in animatorSnapshot
   */
  setThrow(throwFlag: boolean) {
    this.throw = throwFlag;
  }

  getObjects(): Array<Figure | Group> {
    return this.objects;
  }

  removeObject(object: Figure | Group) {
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  /**
   * Set whether the side effect should be run.
   * @param runSideEffect - boolean indicating if the side effect should be run.
   */
  shouldRunSideEffect(runSideEffect: boolean) {
    this.runSideEffect = runSideEffect;
  }
}
