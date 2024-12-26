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

import main from '../main';
import Figure from './figure';
import Line from './figure/line';
import Group from './group';

export default class Animator {
  id: string;
  objects: Array<Figure | Group> = [];
  index = 0;
  throw = false;

  static animationCounter = 0;

  constructor(objects: Array<Figure | Group>) {
    Animator.animationCounter++;
    this.id =
      `animation-${Animator.animationCounter}` +
      Math.random().toString(36).slice(2, 9);
    this.objects = [
      ...objects,
      new Line(0, 0, 0, 0, main.backgroundColor.toString()), // last dummy object acts as a placeholder for the end of the animation
    ];
    this.objects.forEach((object) => object.setAid(this.id));
  }

  draw(): boolean {
    this.objects[this.index].draw();
    this.index++;

    if (this.index === this.objects.length) {
      this.index = 0;
      return true;
    }

    return false;
  }
}