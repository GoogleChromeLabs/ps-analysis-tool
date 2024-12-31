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
  id: string;

  /**
   * Array of objects to be animated. Can be figures or groups.
   * The last object in the array is a dummy object that acts as a placeholder for the end of the animation.
   */
  objects: Array<Figure | Group> = [];

  /**
   * Index of the current object being animated.
   */
  index = 0;

  /**
   * Flag to indicate if the animation should be saved in animatorSnapshot.
   * If true, the animation will NOT be saved in animatorSnapshot.
   */
  throw = false;

  /**
   * Function to be executed when the animation ends.
   */
  sideEffectOnEnd: (() => void) | undefined;

  /**
   * Counter for the number of animations created.
   */
  static animationCounter = 0;

  constructor(objects: Array<Figure | Group>, figureFactory: FigureFactory) {
    Animator.animationCounter++;
    this.id =
      `animation-${Animator.animationCounter}` +
      Math.random().toString(36).slice(2, 9);
    this.objects = [
      ...objects,
      figureFactory.line(0, 0, 0, 0), // last dummy object acts as a placeholder for the end of the animation
    ];
    this.objects.forEach((object) => object.setAid(this.id));
  }

  /**
   * Draws the current object in the animation sequence, and increments the index.
   * If the index reaches the end of the sequence, it resets the index to 0.
   * @returns boolean indicating if the animation has finished
   */
  draw(): boolean {
    if (this.index === this.objects.length - 1) {
      this.index = 0;
      this.sideEffectOnEnd?.();
      return true;
    }

    this.objects[this.index].draw();
    this.index++;

    return false;
  }

  /**
   * Sets a side effect to be executed when the animation ends
   * @param sideEffect - function to be executed when the animation ends
   */
  setSideEffectOnEnd(sideEffect: () => void) {
    this.sideEffectOnEnd = sideEffect;
  }
}
